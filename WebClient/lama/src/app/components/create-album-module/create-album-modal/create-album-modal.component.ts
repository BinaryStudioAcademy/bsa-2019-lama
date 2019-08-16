import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output } from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import imageCompression from 'browser-image-compression';
import { Photo, PhotoRaw } from 'src/app/models';
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

  photos: Photo[] = [];
  album: NewAlbum;

  albumWithExistPhotos: NewAlbumWithExistPhotos;
  ExistPhotosId: number[] = [];

  albumName: string = '';
  checkForm: boolean = true;

  activeColor: string = '#00d1b2';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  dragging: boolean = false;
  loaded: boolean = true;
  imageSrc: string = '';
  LoadNewImage: boolean;
  CreateWithNewPhoto: boolean;
  baseColor: any;

  ExistPhotos: PhotoRaw[] = [];

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
    let files = e.target.files;
    this.LoadFile(files);
  }

  async LoadFile(files) {
    if (this.LoadNewImage === false) {
      this.photos = [];
    }
    this.LoadNewImage = true;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type == "image/jpeg" || files[i].type == "image/jpg") {
        let exifObj = load(await this.toBase64(files[i]));
        let d = dump(exifObj);
        let compressedFile = await imageCompression(files[i], environment.compressionOptions);
        let base64 = await this.toBase64(compressedFile);
        remove(base64);
        let modifiedObject = insert(d, base64);
        this.photos.push({ imageUrl: modifiedObject, filename: files[i].name })
      }
      else {
        let compressedFile = await imageCompression(files[i], environment.compressionOptions);
        this.photos.push({ imageUrl: await this.toBase64(compressedFile), filename: files[i].name });
      }
    };

    this.loaded = true;
  }

  public toBase64(file): Promise<string> {
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
        this.album = { title: this.albumName, photo: this.photos[0], authorId: parseInt(this.currentUser.id), photos: this.photos };
        this.albumService.createAlbumWithNewPhotos(this.album).subscribe((e) => this.toggleModal());
      } else {
        this.albumWithExistPhotos = { title: this.albumName, photosId: this.ExistPhotosId, authorId: parseInt(this.currentUser.id) };
        this.albumService.createAlbumWithExistPhotos(this.albumWithExistPhotos).subscribe((e) => this.toggleModal());
      }
    }
  }

  toggleModal() {
    this.isShown = false;
  }

  ChoosePhoto(e) {
    this.ExistPhotosId = [];
    this.photos = [];
    this.ExistPhotos = [];

    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChooseStoragePhotosComponent);
    const componentRef = this.entry.createComponent(factory);
    let instance = componentRef.instance as ChooseStoragePhotosComponent;
    instance.currentUser = this.currentUser;
    instance.onChange.subscribe((e) => this.onChange(e));
  }
  public onChange(photo: PhotoRaw) {
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

  @ViewChild('ChoosePhotos', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;

  private resolver: ComponentFactoryResolver;

}
