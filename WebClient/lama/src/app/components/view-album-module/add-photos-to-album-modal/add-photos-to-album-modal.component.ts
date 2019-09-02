import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Photo, PhotoRaw, User, CreatedAlbumsArgs } from 'src/app/models';
import { NewAlbum } from 'src/app/models/Album/NewAlbum';
import { NewAlbumWithExistPhotos } from 'src/app/models/Album/NewAlbumWithExistPhotos';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';
import { environment } from '../../../../environments/environment';
import imageCompression from 'browser-image-compression';
import { ChooseStoragePhotosComponent } from '../../create-album-module/choose-storage-photos/choose-storage-photos.component';
import { NotifierService } from 'angular-notifier';
import { FileService } from 'src/app/services';
import { AlbumService } from 'src/app/services/album.service';
import { AlbumExistPhotos } from 'src/app/models/Album/AlbumExistPhotos';
import { AlbumNewPhotos } from 'src/app/models/Album/AlbumNewPhotos';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-photos-to-album-modal',
  templateUrl: './add-photos-to-album-modal.component.html',
  styleUrls: ['./add-photos-to-album-modal.component.sass']
})
export class AddPhotosToAlbumModalComponent implements OnDestroy {
  constructor(
    private resolver: ComponentFactoryResolver,
    private notifier: NotifierService,
    private albumService: AlbumService,
    private fileService: FileService
  ) {
    this.isShown = true;
  }

  @Input()
  public isShown: boolean;

  @Output()
  AddingPhotosToAlbum = new EventEmitter<PhotoRaw[]>();

  @ViewChild('ChoosePhotos', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;

  photos: Photo[] = [];
  imageUrl: string;

  ExistPhotosId: number[] = [];

  AlbumExistPhotos: AlbumExistPhotos;
  AlbumNewPhotos: AlbumNewPhotos;

  activeColor = '#00d1b2';
  overlayColor = 'rgba(255,255,255,0.5)';
  dragging = false;
  loaded = true;
  imageSrc = '';
  LoadNewImage: boolean;
  CreateWithNewPhoto: boolean;
  baseColor: any;
  currentUser: User;
  AlbumId: number;

  ExistPhotos: PhotoRaw[] = [];
  unsubscribe = new Subject();
  photoAlbums: PhotoRaw[] = [];

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
    if (files.type === 'click') {
      return;
    }
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

  ChoosePhoto() {
    this.ExistPhotosId = [];
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
  CreateAlbum() {
    if (this.photos.length === 0) {
      this.notifier.notify('error', 'Error no photos');
    } else if (this.LoadNewImage === true) {
      if (
        this.photos.some(p => this.photoAlbums.some(x => x.name === p.filename))
      ) {
        this.notifier.notify('warning', 'This photos appear to be duplicates');
      } else {
        this.AlbumNewPhotos = {
          AlbumId: this.AlbumId,
          photos: this.photos,
          UserId: this.currentUser.id
        };
        this.albumService
          .addNewPhotosToAlbum(this.AlbumNewPhotos)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            photos => {
              this.AddingPhotosToAlbum.emit(photos);
            },
            error => this.notifier.notify('error', 'Error adding photos')
          );
        this.toggleModal();
      }
    } else {
      this.AlbumExistPhotos = {
        AlbumId: this.AlbumId,
        photosId: this.ExistPhotosId
      };
      this.albumService
        .addExistPhotosToAlbum(this.AlbumExistPhotos)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          photos => {
            if (photos.length !== 0) {
              this.AddingPhotosToAlbum.emit(photos);
              this.notifier.notify('success', 'Photos added');
            } else {
              this.notifier.notify('error', 'Photos already exist in album');
            }
          },
          error => this.notifier.notify('error', 'Error adding photos')
        );
      this.toggleModal();
    }
  }

  toggleModal() {
    this.isShown = false;
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
