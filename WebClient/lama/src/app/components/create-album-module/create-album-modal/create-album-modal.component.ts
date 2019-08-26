import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Output,
  EventEmitter
} from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import imageCompression from 'browser-image-compression';
import { Photo, PhotoRaw, CreatedAlbumsArgs } from 'src/app/models';
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/models/User/user';
import { NewAlbum } from 'src/app/models/Album/NewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { NewAlbumWithExistPhotos } from 'src/app/models/Album/NewAlbumWithExistPhotos';
import { load, dump, insert,  remove } from 'piexifjs';
import { NotifierService } from 'angular-notifier';
import { FileService } from 'src/app/services/file.service';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {
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
  albumsTitles: string[] = [];
  albumName = '';
  checkForm = true;

  activeColor = '#00d1b2';
  overlayColor = 'rgba(255,255,255,0.5)';
  dragging = false;
  loaded = true;
  imageSrc = '';
  LoadNewImage: boolean;
  CreateWithNewPhoto: boolean;
  baseColor: any;

  ExistPhotos: PhotoRaw[] = [];

  @Output()
  createdAlbumEvent = new EventEmitter<CreatedAlbumsArgs>();

  @Output()
  currentUser: User;

  @Input()
  public isShown: boolean;

  constructor(
    resolver: ComponentFactoryResolver,
    private albumService: AlbumService,
    private fileService: FileService,
    private notifier: NotifierService
  ) {
    this.isShown = true;
    this.resolver = resolver;
  }

  ngOnInit() {}

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
        const compressedFile = await imageCompression(
          file,
          environment.compressionOptions
        );
        const base64 = await this.toBase64(compressedFile);
        remove(base64);
        const modifiedObject = insert(d, base64);
        this.photos.push({ imageUrl: modifiedObject, filename: file.name });
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
    }
    if (this.albumsTitles.indexOf(this.albumName) !== -1) {
      this.checkForm = false;
      this.notifier.notify('error', 'Album with this title already exists');
    } else {
      if (this.photos.length === 0) {
        this.album = {
          title: this.albumName,
          photo: this.photos[0],
          authorId: this.currentUser.id,
          photos: this.photos
        };
        this.albumService.createEmptyAlbum(this.album).subscribe(
          createdAlbum => {
            this.createdAlbumEvent.emit(createdAlbum);
            this.notifier.notify('success', 'Empty Album created');
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
        this.albumService.createAlbumWithNewPhotos(this.album).subscribe(
          returnAlbum => {
            const filteredPhotos = this.resolveDuplicates(returnAlbum.photoAlbums);
            this.albumService.getAlbum(returnAlbum.id).subscribe(
              x => {
                const album = x.body;
                if (album.photo !== null) {
                  this.createdAlbumEvent.emit({
                    id: album.id,
                    name: album.title,
                    photoUrl: album.photo.blob256Id || album.photo.blobId,
                    title: album.title
                  });
                }
              },
              error => this.notifier.notify('error', 'Error loading the album')
            );
            if (!this.duplicatesFound) {
              this.notifier.notify('success', 'Album created');
              this.toggleModal();
            } else {
              this.removeUploaded(filteredPhotos);
              this.notifier.notify('warning', 'This photos appear to be duplicates. Upload them anyway?');
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
          .subscribe(
            createdAlbum => {
              this.createdAlbumEvent.emit(createdAlbum);
              this.notifier.notify('success', 'Album created');
            },
            error => this.notifier.notify('error', 'Error creating the album')
          );
        }
    }
  }
  removeUploaded(filteredPhotos: PhotoRaw[]) {
    filteredPhotos.forEach(filtered => {
      const index = this.photos.findIndex(photo => photo.filename === filtered.name);
      this.photos.splice(index, 1);
    });
  }
  resolveDuplicates(uploadedPhotos: PhotoRaw[]) {
    if (uploadedPhotos.some(photo => photo.isDuplicate)) {
      this.duplicates = uploadedPhotos.filter(photo => photo.isDuplicate);
      uploadedPhotos = uploadedPhotos.filter((photo) => !this.duplicates.includes(photo));
      this.duplicatesFound = true;
    }
    return uploadedPhotos;
  }

  isDuplicate(photo: Photo) {
    return this.duplicates.some(duplicate => duplicate.name === photo.filename);
  }

  toggleModal() {
    this.isShown = false;
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
      this.fileService.getPhoto(photo.blob256Id).subscribe(url => {
        this.photos.push({ imageUrl: url });
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
}
