import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import imageCompression from 'browser-image-compression';
import { Photo, PhotoRaw, CreatedAlbumsArgs } from 'src/app/models';
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/models/User/user';
import { NewAlbum } from 'src/app/models/Album/NewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { NewAlbumWithExistPhotos } from 'src/app/models/Album/NewAlbumWithExistPhotos';
import { load, dump, insert, remove } from 'piexifjs';
import { NotifierService } from 'angular-notifier';
import { FileService } from 'src/app/services/file.service';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  getLocation,
  getLatitude,
  getLongitude,
  getShortAddress,
  getFormattedAdress
} from 'src/app/export-functions/exif';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit, OnDestroy {
  @ViewChild('ChoosePhotos', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;

  private resolver: ComponentFactoryResolver;

  photos: Photo[] = [];
  album: NewAlbum;
  imageUrl: string;
  showRemoveButton = false;
  albumWithExistPhotos: NewAlbumWithExistPhotos;
  ExistPhotosId: number[] = [];
  duplicates: PhotoRaw[] = [];
  duplicatesFound = false;

  albumName = '';
  checkForm = true;
  geoCoder;
  activeColor = '#00d1b2';
  overlayColor = 'rgba(255,255,255,0.5)';
  dragging = false;
  loaded = true;
  imageSrc = '';
  LoadNewImage: boolean;
  CreateWithNewPhoto: boolean;
  baseColor: any;
  createdAlbum: ViewAlbum;

  ExistPhotos: PhotoRaw[] = [];
  isUniqueName = true;

  @Output()
  createdAlbumEvent = new EventEmitter<CreatedAlbumsArgs>();

  @Output()
  currentUser: User;

  @Input()
  public isShown: boolean;
  albumsTitles = new Array<string>();
  unsubscribe = new Subject();

  constructor(
    resolver: ComponentFactoryResolver,
    private albumService: AlbumService,
    private fileService: FileService,
    private notifier: NotifierService,
    private mapsAPILoader: MapsAPILoader
  ) {
    this.isShown = true;
    this.resolver = resolver;
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    const files = e.dataTransfer.files;
    e.preventDefault();
    this.dragging = false;
    this.LoadFile(files);
  }

  handleInputChange(e) {
    const files = e.target.files;
    this.LoadFile(files);
  }

  async LoadFile(files) {
    if (this.LoadNewImage === false) {
      this.photos = [];
    }
    this.LoadNewImage = true;

    for (const file of files) {
      this.loaded = false;
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const exifObj = load(await this.toBase64(file));
        const d = dump(exifObj);
        const latitude = getLatitude(exifObj);
        const longitude = getLongitude(exifObj);
        const compressedFile = await imageCompression(
          file,
          environment.compressionOptions
        );
        const base64 = await this.toBase64(compressedFile);
        remove(base64);
        const modifiedObject = insert(d, base64);

        if (latitude && longitude) {
          getLocation(latitude, longitude, this.geoCoder).then(location => {
            const address = getFormattedAdress(location);
            const shortname = getShortAddress(location);
            this.photos.push({
              imageUrl: modifiedObject,
              filename: file.name,
              location: address,
              coordinates: latitude + ',' + longitude,
              shortLocation: shortname
            });
          });
        } else {
          this.photos.push({
            imageUrl: modifiedObject,
            filename: file.name
          });
        }
      } else {
        const compressedFile = await imageCompression(
          file,
          environment.compressionOptions
        );
        this.photos.push({
          imageUrl: await this.toBase64(compressedFile),
          filename: file.name
        });
      }
    }

    this.loaded = true;
  }

  toBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  CreateAlbum() {
    if (this.albumName === '') {
      this.checkForm = false;
    } else if (this.albumsTitles.includes(this.albumName)) {
      this.isUniqueName = false;
      this.checkForm = false;
    } else {
      this.loaded = false;
      if (this.photos.length === 0) {
        this.album = {
          title: this.albumName,
          photo: this.photos[0],
          authorId: this.currentUser.id,
          photos: this.photos
        };
        this.albumService
          .createEmptyAlbum(this.album)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            createdAlbum => {
              this.createdAlbumEvent.emit({
                id: createdAlbum.id,
                name: createdAlbum.title,
                photo: null,
                title: createdAlbum.title
              });
              this.notifier.notify('success', 'Empty Album created');
              this.toggleModal();
            },
            error => this.notifier.notify('error', 'Error creating the album')
          );
      } else if (this.LoadNewImage === true) {
        this.album = {
          title: this.albumName,
          photo: this.photos[0],
          authorId: this.currentUser.id,
          photos: this.photos
        };
        this.albumService
          .createAlbumWithNewPhotos(this.album)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            returnedAlbum => {
              const filteredPhotos = this.resolveDuplicates(
                returnedAlbum.photoAlbums
              );
              if (returnedAlbum.photo !== null) {
                this.createdAlbumEvent.emit({
                  id: returnedAlbum.id,
                  name: returnedAlbum.title,
                  photo: returnedAlbum.photo,
                  title: returnedAlbum.title
                });
              }
              if (!this.duplicatesFound) {
                this.notifier.notify('success', 'Album created');
                this.toggleModal();
              } else {
                this.removeUploaded(filteredPhotos);
                this.notifier.notify(
                  'warning',
                  'This photos appear to be duplicates. Upload them anyway?'
                );
              }
            },
            error => this.notifier.notify('error', 'Error creating the album')
          );
      } else {
        this.albumWithExistPhotos = {
          title: this.albumName,
          photosId: this.ExistPhotosId,
          authorId: this.currentUser.id
        };
        this.albumService
          .createAlbumWithExistPhotos(this.albumWithExistPhotos)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            createdAlbum => {
              this.createdAlbumEvent.emit({
                id: createdAlbum.id,
                name: createdAlbum.title,
                photo: createdAlbum.photo || createdAlbum.photo,
                title: createdAlbum.title
              });
              this.notifier.notify('success', 'Album created');
              this.toggleModal();
            },
            error => this.notifier.notify('error', 'Error creating the album')
          );
      }
    }
  }

  removeUploaded(filteredPhotos: PhotoRaw[]) {
    filteredPhotos.forEach(filtered => {
      const index = this.photos.findIndex(
        photo => photo.filename === filtered.name
      );
      this.photos.splice(index, 1);
    });
  }

  resolveDuplicates(uploadedPhotos: PhotoRaw[]) {
    if (uploadedPhotos.some(photo => photo.isDuplicate)) {
      this.duplicates = uploadedPhotos.filter(photo => photo.isDuplicate);
      uploadedPhotos = uploadedPhotos.filter(
        photo => !this.duplicates.includes(photo)
      );
      this.duplicatesFound = true;
    }
    return uploadedPhotos;
  }

  isDuplicate(photo: Photo) {
    return this.duplicates.some(duplicate => duplicate.name === photo.filename);
  }

  toggleModal() {
    this.isShown = false;
    this.loaded = true;
  }

  ChoosePhoto() {
    this.ExistPhotosId = [];
    this.photos = [];
    this.ExistPhotos = [];

    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(
      ChooseStoragePhotosComponent
    );
    const componentRef = this.entry.createComponent(factory);
    const instance = componentRef.instance as ChooseStoragePhotosComponent;
    instance.currentUser = this.currentUser;
    instance.Change.subscribe(
      (event: PhotoRaw) => this.onChange(event),
      error => this.notifier.notify('error', 'Error downloading')
    );
  }

  onChange(photo: PhotoRaw) {
    if (this.LoadNewImage === true) {
      this.photos = [];
    }
    this.LoadNewImage = false;
    if (this.ExistPhotos.filter(x => x.id === photo.id)[0] === undefined) {
      this.ExistPhotosId.push(photo.id);
      this.fileService
        .getPhoto(photo.blob256Id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(url => {
          this.photos.push({ imageUrl: url, description: photo.description });
          this.ExistPhotos.push(photo);
        });
    } else {
      this.ExistPhotosId = this.ExistPhotosId.filter(x => x !== photo.id);
      this.ExistPhotos = this.ExistPhotos.filter(x => x.id !== photo.id);
      this.photos = this.photos.filter(x => x.imageUrl !== photo.blob256Id);
    }
  }

  mouseEnterOverlayHandler() {
    this.showRemoveButton = true;
  }

  mouseLeftOverlayHandler() {
    this.showRemoveButton = false;
  }

  removePhoto(index: number) {
    if (index !== -1) {
      this.photos.splice(index, 1);
    }
  }

  createWithDuplicates() {
    this.fileService
      .uploadDuplicates(this.duplicates as UploadPhotoResultDTO[])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        uploadedDuplicates => {
          this.albumService.addNewPhotosToAlbum({
            AlbumId: this.createdAlbum.id,
            UserId: this.album.authorId,
            photos: this.photos
          });
          this.notifier.notify('success', 'Duplicates uploaded');
          this.toggleModal();
        },
        error => this.notifier.notify('error', 'Error sending photos')
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
