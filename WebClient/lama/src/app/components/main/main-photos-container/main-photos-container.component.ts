import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnChanges, DoCheck, EventEmitter, Output } from '@angular/core';

import { Photo } from 'src/app/models';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { FileService } from 'src/app/services/file.service';
import { SharedService } from 'src/app/services/shared.service';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/models/User/user';
import { FavoriteService } from 'src/app/services/favorite.service';
import { AuthService, UserService } from 'src/app/services';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as JSZipUtils from 'jszip-utils';
import { ZipService } from 'src/app/services/zip.service';
import { delay } from 'q';

@Component({
  selector: 'main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass'],
  providers: [FavoriteService, ZipService, UserService]
})
export class MainPhotosContainerComponent implements OnInit {

  // properties
  // showUploadModal: boolean = false;
  @Input() photos: PhotoRaw[] = [];
  showSpinner = true;
  isNothingFounded: boolean;
  isSearchTriggered: boolean;
  currentUser : User;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  favorites: Set<number> = new Set<number>();

  // fields
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef })
  private modalUploadPhotoEntry: ViewContainerRef;

  // constructors
  constructor(
    private resolver: ComponentFactoryResolver,
    private service: FileService,
    private shared: SharedService,
    private _favoriteService: FavoriteService,
    private zipService: ZipService,
    private userService: UserService)
  {
    this.favorites = new Set<number>();
  }

  ngOnInit(){
    this.GetPhotos();
    this.selectedPhotos = []
    let userId: string = localStorage.getItem('userId');
    if(userId == null){
      let email = localStorage.getItem('email');
      if(email != null)
        this.userService.getUserByEmailObservation(email)
          .subscribe(user => this.initializeUserAndFavorites(user));
      else
        console.log("Occured error! Please, try later");
      }
    else
      this.userService.getUser(parseInt(userId))
        .subscribe(user => this.initializeUserAndFavorites(user));
  }

  initializeUserAndFavorites(user: User){
    this.currentUser = user;
      this._favoriteService.getFavoritesIds(parseInt(this.currentUser.id))
          .subscribe(data => this.favorites = new Set<number>(data));
    };

  public GetUserPhotos(UserId: number) {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
      this.showSpinner = false;
    });
  }

  GetPhotos() {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
      this.showSpinner = false;
      console.log(this.photos);
    }, err => {
      console.log(err);
      this.showSpinner = false;
      this.isNothingFounded = true;
    });
  }

  ngDoCheck() {
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.push(element);
      });
    }
    if (this.shared.foundedPhotos.length != 0 && this.shared.isSearchTriggered) {
      this.photos = this.shared.foundedPhotos;
      this.isNothingFounded = false;
    }
    if (this.shared.foundedPhotos.length == 0 && this.shared.isSearchTriggered) {
      this.photos = [];
      this.isNothingFounded = true;
    }
    this.isSearchTriggered = this.shared.isSearchTriggeredAtLeastOnce;
    if (this.isSearchTriggered) {
      this.selectedPhotos = []
    }
    this.shared.isSearchTriggered = false;
    this.shared.foundedPhotos = []
    this.shared.photos = []
    if (this.selectedPhotos.length > 0) {
      this.isAtLeastOnePhotoSelected = true;
    }
    else {
      this.isAtLeastOnePhotoSelected = false;
    }
  }


  // methods
  public uploadFile(event)
  {
    this.modalUploadPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.modalUploadPhotoEntry.createComponent(factory);

    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToListEvent.subscribe(this.uploadPhotoHandler.bind(this));
    componentRef.instance.toggleModal();
  }
  public uploadPhotoHandler(uploadedPhotos: UploadPhotoResultDTO[]): void
  {
      this.photos.push(...uploadedPhotos);
  }

  public photoSelected(eventArgs: PhotoRawState)
  {
    if (eventArgs.isSelected)
      this.selectedPhotos.push(eventArgs.photo);
    else 
    {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  public photoClicked(eventArgs: PhotoRaw)
  {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvenet.subscribe(this.deletePhotoHandler.bind(this));
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent.subscribe(this.updatePhotoHandler.bind(this));
  }

  public deletePhotoHandler(photoToDeleteId: number): void
  {
    this.photos = this.photos.filter(p => p.id !== photoToDeleteId);
  }

  public updatePhotoHandler(updatedPhoto: PhotoRaw): void
  {
    let index = this.photos.findIndex(i => i.id === updatedPhoto.id);
    this.photos[index] = updatedPhoto
  }

  private deleteImages(): void
  {
    this.selectedPhotos.forEach(element => {
      this.service.markPhotoAsDeleted(element.id)
      .subscribe(res => {
        this.deletePhotoHandler(element.id);
      });
    });
  }

  public downloadImages() {
      this.zipService.downloadImages(this.selectedPhotos);
  }
}
