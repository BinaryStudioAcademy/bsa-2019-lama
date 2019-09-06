import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy
} from '@angular/core';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import {
  UpdatePhotoDTO,
  ImageEditedArgs,
  MenuItem,
  Photo
} from 'src/app/models';
import { FileService, AuthService, UserService } from 'src/app/services';
import { User } from 'src/app/models/User/user';
import { NewLike } from 'src/app/models/Reaction/NewLike';
import * as bulmaCalendar from 'bulma-calendar';
import { load } from 'piexifjs';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { PhotoDetailsAlbum } from 'src/app/models/Album/PhotodetailsAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { Entity } from 'src/app/models/entity';
import { isUndefined } from 'util';
import { NotifierService } from 'angular-notifier';
import {
  getLocation,
  getLatitude,
  getLongitude,
  getFormattedAdress
} from 'src/app/export-functions/exif';
import { NewDescription } from 'src/app/models/Photo/NewDescription';
import { PhotodetailsService } from 'src/app/services/photodetails.service';
import { NewLocation } from 'src/app/models/Photo/NewLocation';
import { NewPhotoDate } from 'src/app/models/Photo/NewPhotoDate';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit, OnDestroy {
  // properties
  @Input()
  photo: PhotoRaw;
  @Input()
  currentIndex: number;
  @Input()
  photosArrayLength: number;
  photos: PhotoRaw[] = [];
  isShown: boolean;
  items = [{ name: 'data:image/jpeg;base64,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' },
  { name: 'https://images.unsplash.com/photo-1541233349642-6e425fe6190e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80' },
  { name: 'mumu' }];
  isInfoShown = false;
  imageUrl: string;
  userId: number;
  showSharedModal = false;
  showSharedByLinkModal = false;
  showSharedByEmailModal = false;
  albums: PhotoDetailsAlbum[] = [];
  isShowSpinner = true;
  clickedMenuItem: MenuItem;
  shownMenuItems: MenuItem[];
  isEditing: boolean;
  isDeleting: boolean;
  showEditModal: boolean;

  // events
  @Output()
  deletePhotoEvent = new EventEmitter<number>();
  @Output()
  updatePhotoEvent = new EventEmitter<PhotoRaw>();
  @Output()
  changePhotoEvent = new EventEmitter<boolean>();
  hasUserReaction: boolean;

  // fields
  private fileService: FileService;
  private authService: AuthService;
  private userService: UserService;
  private lastDescription: string;
  private defaultMenuItem: MenuItem[];
  currentUser: User;

  // location
  latitude: number;
  longitude: number;
  zoom: number;
  @Input() address = '';
  private geoCoder;
  GPS: any;
  @ViewChild('search', { static: true })
  searchElementRef: ElementRef;
  unsubscribe = new Subject();

  // constructors
  constructor(
    fileService: FileService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private albumService: AlbumService,
    authService: AuthService,
    userService: UserService,
    private notifier: NotifierService,
    private router: Router,
    private photodetailsService: PhotodetailsService
  ) {
    this.isShown = true;
    this.fileService = fileService;
    this.authService = authService;
    this.userService = userService;

    this.initializeMenuItem();
    this.shownMenuItems = this.defaultMenuItem;
    this.clickedMenuItem = null;
  }

  ngOnInit() {
    this.lastDescription = this.photo.description;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
    this.fileService
      .getPhoto(this.photo.blobId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.imageUrl = data;
        this.isShowSpinner = false;
        this.GetFile();
      });
    this.userId = this.authService.getLoggedUserId();
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        user => {
          this.currentUser = user;
          let reactions = this.photo.reactions;

          if (reactions === null) {
            reactions = [];
          } else {
            this.hasUserReaction = reactions.some(
              x => x.userId === this.currentUser.id
            );
          }
        },
        error => this.notifier.notify('error', 'Error getting user')
      );
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  UpdateDate(e: Date) {
    const date: NewPhotoDate = {
      id: this.photo.id,
      date: e
    };
    this.photodetailsService
      .UpdateDate(date)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        a => {
          this.photo.uploadDate = a;
          this.notifier.notify('success', 'Date updated');
        },
        error => this.notifier.notify('error', 'Error updating date')
      );
  }
  UpdateLocation(e: NewLocation) {
    this.photodetailsService.updateLocation(e).subscribe(
      a => {
        this.address = a;
        this.photo.location = a;
        this.photo.coordinates = e.coordinates;
        this.notifier.notify('success', 'Location updated');
        this.CloseModalForPicklocation(e);
      },
      error => {
        this.notifier.notify('error', 'Error updating location');
        this.CloseModalForPicklocation(e);
      }
    );
  }
  DeleteLocation(e) {
    this.photodetailsService.DeleteLocation(this.photo.id).subscribe(
      a => {
        this.address = '';
        this.photo.location = '';
        this.photo.coordinates = '';
        this.notifier.notify('success', 'Location updated');
        this.CloseModalForPicklocation(e);
      },
      error => {
        this.notifier.notify('error', 'Error updating location');
        this.CloseModalForPicklocation(e);
      }
    );
  }
  getAddress(latitude, longitude) {
    getLocation(latitude, longitude, this.geoCoder).then(
      (this.address = getFormattedAdress(location))
    );
    const loggedUserId: number = this.authService.getLoggedUserId();
    this.userService
      .getUser(loggedUserId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        user => {
          this.currentUser = user;

          if (this.photo.reactions != null) {
            this.hasUserReaction = this.photo.reactions.some(
              x => x.userId === this.currentUser.id
            );
          } else {
            this.hasUserReaction = false;
          }
        },
        error => this.notifier.notify('error', 'Error getting user')
      );
  }

  // GET EXIF
  GetFile() {
    if (this.photo.location !== null && this.photo.location !== undefined) {
      this.address = this.photo.location;
    } else if (this.photo.name.endsWith('.png')) {
      return;
    } else {
      const src = this.imageUrl;
      const exifObj = load(src);
      this.latitude = getLatitude(exifObj);
      this.longitude = getLongitude(exifObj);
      if (this.latitude && this.longitude) {
        getLocation(this.latitude, this.longitude, this.geoCoder).then(
          (this.address = getFormattedAdress(location))
        );
      }
    }
  }
  private initializeMenuItem() {
    this.defaultMenuItem = [
      { title: 'Share', icon: 'share' },
      { title: 'Remove', icon: 'clear' },
      { title: 'Download', icon: 'cloud_download' },
      { title: 'Edit', icon: 'edit' },
      { title: 'Info', icon: 'info' },
      { title: 'Save', icon: 'save' }
    ];
  }

  // methods
  menuClickHandler(clickedMenuItem: MenuItem): void {
    this.clickedMenuItem = clickedMenuItem;

    // share
    if (clickedMenuItem === this.defaultMenuItem[0]) {
      this.openShareModal();
    }

    // remove
    if (clickedMenuItem === this.defaultMenuItem[1]) {
      if (this.router.url.includes('album')) {
        this.photos.push(this.photo);
        this.isDeleting = true;
      } else {
        this.deleteImage();
      }
    }

    // download

    // edit
    if (clickedMenuItem === this.defaultMenuItem[3]) {
      this.isEditing = true;
    }

    if (clickedMenuItem === this.defaultMenuItem[5]) {
      this.saveMe();
    }

    // info
    if (clickedMenuItem === this.defaultMenuItem[4]) {
      if (this.isInfoShown === false) {
        this.albumService
          .GetPhotoDetailsAlbums(this.photo.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            e => {
              this.albums = e.body;
            },
            error =>
              this.notifier.notify('error', 'Error loading photo details')
          );
      }
      this.CloseInfo();
    }
  }

  mouseLeftOverlayHandler(): void {
    this.shownMenuItems = this.defaultMenuItem;
  }

  saveEditedImageHandler(editedImage: ImageEditedArgs): void {
    this.isShowSpinner = true;
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: editedImage.originalImageUrl,
      imageBase64: editedImage.editedImageBase64
    };

    this.fileService
      .update(updatePhotoDTO)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        updatedPhotoDTO => {
          Object.assign(this.photo, updatedPhotoDTO);
          this.fileService
            .getPhoto(this.photo.blobId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(url => (this.imageUrl = url));
          this.updatePhotoEvent.emit(this.photo);
          this.goBackToImageView();
          this.notifier.notify('success', 'Photo updated');
          this.isShowSpinner = false;
        },
        error => this.notifier.notify('error', 'Error updating photo')
      );
  }

  ChangeDescription(desc) {
    if (this.lastDescription === this.photo.description) {
      return;
    }
    const newdesc: NewDescription = {
      id: this.photo.id,
      description: desc
    };
    this.photodetailsService
      .updateDescription(newdesc)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        descr => {
          this.photo.description = descr;
          this.notifier.notify('success', 'Description Updated');
        },
        error => this.notifier.notify('error', 'Error updating description')
      );
  }
  resetImageHandler(): void {
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: this.photo.blobId,
      imageBase64: ''
    };
    this.fileService
      .getPhoto(this.photo.originalBlobId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        url => {
          this.imageUrl = url;
          updatePhotoDTO.imageBase64 = url;
          this.fileService
            .update(updatePhotoDTO)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(updatedPhotoDTO => {
              Object.assign(this.photo, updatedPhotoDTO);
              this.updatePhotoEvent.emit(this.photo);
              this.goBackToImageView();
              this.notifier.notify('success', 'Photo reseted');
            });
        },
        error => this.notifier.notify('error', 'Error reseting photo')
      );
  }

  goBackToImageView(): void {
    this.isEditing = false;
    this.isDeleting = false;
  }

  closeModal(): void {
    this.isShown = false;
  }

  private openShareModal(): void {
    this.showSharedModal = !this.showSharedModal;
  }

  openShareByLink() {
    this.showSharedByLinkModal = true;
  }

  openShareByEmail() {
    this.showSharedByEmailModal = true;
  }

  private deleteImage(): void {
    this.fileService
      .markPhotoAsDeleted(this.photo.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        res => {
          this.closeModal();
          this.deletePhotoEvent.emit(this.photo.id);
          this.notifier.notify('success', 'Photo deleted');
        },
        error => this.notifier.notify('error', 'Error deleting image')
      );
  }

  deleteImages(photos: number[]) {
    for (const p of photos) {
      this.deletePhotoEvent.emit(p);
    }
    this.closeModal();
  }

  ReactionPhoto() {
    // TODO: you can not like your own photos
    // but currently we are testing
    // so lets suppose you can like any photos

    // TODO: uncomment line below
    // also maybe hide like from HTML if its your photo

    // if (this.photo.userId === parseInt(this.currentUser.id)) return;
    if (this.photo.reactions === null) {
      this.photo.reactions = [];
    }
    const hasreaction = this.photo.reactions.some(
      x => x.userId === this.currentUser.id
    );
    const newReaction: NewLike = {
      photoId: this.photo.id,
      userId: this.currentUser.id
    };
    if (hasreaction) {
      this.fileService
        .RemoveReactionPhoto(newReaction)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => {
            this.photo.reactions = this.photo.reactions.filter(
              e => e.userId !== this.currentUser.id
            );
            this.hasUserReaction = false;
          },
          error => this.notifier.notify('error', 'Error removing reaction')
        );
    } else {
      this.fileService
        .ReactionPhoto(newReaction)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          newLikeId => {
            this.photo.reactions.push({
              id: newLikeId,
              userId: this.currentUser.id,
              photoId: this.photo.id,
              user: { id: this.currentUser.id } as Entity,
              photo: { id: this.photo.id } as Entity
            });
            this.hasUserReaction = true;
          },
          error => this.notifier.notify('error', 'Error creating reaction')
        );
    }
  }

  forceDownload() {
    const fileName = this.photo.name;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.imageUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const urlCreator = window.URL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  }

  openModalForPickDate(event) {
    const overlay = document.getElementsByClassName('overlay-date')[0];
    const modalElem = document.getElementsByClassName('modal-date')[0];
    modalElem.classList.add('active');
    overlay.classList.add('active');
  }
  CloseModalForPickDate(event) {
    const overlay = document.getElementsByClassName('overlay-date')[0];
    const modalElem = document.getElementsByClassName('modal-date')[0];
    modalElem.classList.remove('active');
    overlay.classList.remove('active');
  }
  openModalForPickCoord(event) { }

  CloseInfo() {
    this.isInfoShown = !this.isInfoShown;
  }

  openModalForPicklocation(event) {
    if (!this.isBlockById()) {
      const overlay = document.getElementsByClassName('overlay-location')[0];
      const modalElem = document.getElementsByClassName('modal-location')[0];
      modalElem.classList.add('active');
      overlay.classList.add('active');
    }
  }
  CloseModalForPicklocation(event) {
    const overlay = document.getElementsByClassName('overlay-location')[0];
    const modalElem = document.getElementsByClassName('modal-location')[0];
    modalElem.classList.remove('active');
    overlay.classList.remove('active');
  }

  isBlockById() {
    return this.photo.userId !== this.userId;
  }

  saveMe() {
    const photos: Photo[] = [
      {
        imageUrl: this.imageUrl,
        description: this.photo.description,
        authorId: this.userId,
        filename: this.photo.name,
        location: this.photo.location
      }
    ];

    this.fileService
      .sendPhotos(photos)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        uploadedPhotos => {
          this.notifier.notify('success', 'Photo saved');
        },
        error => this.notifier.notify('error', 'Error saving photo')
      );
  }

  previousPhoto() {
    this.changePhotoEvent.emit(false);
  }

  nextPhoto() {
    this.changePhotoEvent.emit(true);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
