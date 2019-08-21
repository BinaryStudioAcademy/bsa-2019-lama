import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import imageCompression from 'browser-image-compression';
import { Photo, PhotoRaw, CreatedAlbumsArgs } from 'src/app/models';
import { environment } from '../../../../environments/environment';
import { Album } from 'src/app/models/Album/album';
import { User } from 'src/app/models/User/user';
import { HttpService } from 'src/app/services/http.service';
import { NewAlbum } from 'src/app/models/Album/NewAlbum';
import { isUndefined } from 'util';
import { AlbumService } from 'src/app/services/album.service';
import { NewAlbumWithExistPhotos } from 'src/app/models/Album/NewAlbumWithExistPhotos';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';

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

  albumWithExistPhotos: NewAlbumWithExistPhotos;
  ExistPhotosId: number[] = [];

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

  constructor(resolver: ComponentFactoryResolver, private albumService: AlbumService) {
    this.isShown = true;
    this.resolver = resolver;
  }

  ngOnInit() {
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
        const compressedFile = await imageCompression(file, environment.compressionOptions);
        const base64 = await this.toBase64(compressedFile);
        remove(base64);
        const modifiedObject = insert(d, base64);
        this.photos.push({ imageUrl: modifiedObject, filename: file.name });
      } else {
        const compressedFile = await imageCompression(file, environment.compressionOptions);
        this.photos.push({ imageUrl: await this.toBase64(compressedFile), filename: file.name });
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
      console.log(this.albumName);
      this.checkForm = false;
    } else {
      if (this.LoadNewImage === true) {
        this.album = { title: this.albumName, photo: this.photos[0], authorId: this.currentUser.id, photos: this.photos };
        this.albumService.createAlbumWithNewPhotos(this.album)
        .subscribe((createdAlbum) => {
          console.log(createdAlbum);

          this.createdAlbumEvent.emit({
            id: createdAlbum.id,
            name: createdAlbum.title,
            photoUrl: createdAlbum.photo.blob256Id || createdAlbum.photo.blobId,
            title: createdAlbum.title
          });
        });
      } else {
        this.albumWithExistPhotos = { title: this.albumName, photosId: this.ExistPhotosId, authorId: this.currentUser.id };
        this.albumService.createAlbumWithExistPhotos(this.albumWithExistPhotos)
        .subscribe((createdAlbum) => {
          console.log(createdAlbum);

          this.createdAlbumEvent.emit({
            id: createdAlbum.id,
            name: createdAlbum.title,
            photoUrl: createdAlbum.photo.blob256Id || createdAlbum.photo.blobId,
            title: createdAlbum.title
          });
        });
      }
      this.toggleModal();
    }
  }

  toggleModal() {
    this.isShown = false;
  }

  ChoosePhoto() {
    this.ExistPhotosId = [];
    this.photos = [];
    this.ExistPhotos = [];

    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChooseStoragePhotosComponent);
    const componentRef = this.entry.createComponent(factory);
    const instance = componentRef.instance as ChooseStoragePhotosComponent;
    instance.currentUser = this.currentUser;
    instance.Change.subscribe((event: PhotoRaw) => this.onChange(event));
  }
  onChange(photo: PhotoRaw) {
    if (this.LoadNewImage === true) {
      this.photos = [];
    }
    this.LoadNewImage = false;
    if (this.ExistPhotos.filter(x => x.id === photo.id)[0] === undefined) {
      this.ExistPhotosId.push(photo.id);
      this.photos.push({ imageUrl: photo.blob256Id || photo.blobId });
      this.ExistPhotos.push(photo);
    } else {
      this.ExistPhotosId = this.ExistPhotosId.filter(x => x !== photo.id);
      this.ExistPhotos = this.ExistPhotos.filter(x => x.id !== photo.id);
      this.photos = this.photos.filter(x => x.imageUrl !== photo.blob256Id);
    }
  }
}
