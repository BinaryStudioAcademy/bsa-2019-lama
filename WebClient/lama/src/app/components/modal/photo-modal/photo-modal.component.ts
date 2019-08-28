import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  NgZone
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
  getLongitude
} from 'src/app/export-functions/exif';
import { NewDescription } from 'src/app/models/Photo/NewDescription';
import { PhotodetailsService } from 'src/app/services/photodetails.service';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit {
  // properties
  @Input()
  photo: PhotoRaw;
  photos: PhotoRaw[] = [];
  isShown: boolean;
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

  // constructors
  constructor(
    fileService: FileService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private albumService: AlbumService,
    authService: AuthService,
    userService: UserService,
    private notifier: NotifierService,
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
    this.fileService.getPhoto(this.photo.blobId).subscribe(data => {
      this.imageUrl = data;
      this.isShowSpinner = false;
      this.GetFile();
    });
    this.userId = this.authService.getLoggedUserId();
    this.userService.getUser(this.userId).subscribe(
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

  getAddress(latitude, longitude) {
    getLocation(latitude, longitude, this.geoCoder).then(
      location => (this.address = location)
    );
    const loggedUserId: number = this.authService.getLoggedUserId();
    this.userService.getUser(loggedUserId).subscribe(
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
    if (this.photo.name.endsWith('.png')) {
      return;
    }
    const src = this.imageUrl;
    const exifObj = load(src);
    this.latitude = getLatitude(exifObj);
    this.longitude = getLongitude(exifObj);
    if (this.latitude && this.longitude) {
      getLocation(this.latitude, this.longitude, this.geoCoder).then(
        location => (this.address = location)
      );
    }
    // load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   if ('geolocation' in navigator) {
    //     navigator.geolocation.getCurrentPosition(position => {
    //       // this.latitude = position.coords.latitude;
    //       // this.longitude = position.coords.longitude;
    //       this.zoom = 8;
    //       this.getAddress(this.latitude, this.longitude);
    //     });
    //   }
    //   // tslint:disable-next-line: new-parent

    /*
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ['address']
          });
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              // get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              // set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 12;
            });
          });*/
    // });
  }
  private initializeMenuItem() {
    this.defaultMenuItem = [
      { title: 'share', icon: 'share' },
      { title: 'remove', icon: 'clear' },
      { title: 'download', icon: 'cloud_download' },
      { title: 'edit', icon: 'edit' },
      { title: 'info', icon: 'info' },
      { title: 'save', icon: 'save' }
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
      this.photos.push(this.photo);
      this.isDeleting = true;
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
        this.albumService.GetPhotoDetailsAlbums(this.photo.id).subscribe(
          e => {
            this.albums = e.body;
          },
          error => this.notifier.notify('error', 'Error loading photo details')
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

    this.fileService.update(updatePhotoDTO).subscribe(
      updatedPhotoDTO => {
        Object.assign(this.photo, updatedPhotoDTO);
        this.fileService
          .getPhoto(this.photo.blobId)
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
    this.photodetailsService.updateDescription(newdesc).subscribe(
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
    this.fileService.getPhoto(this.photo.originalBlobId).subscribe(
      url => {
        this.imageUrl = url;
        updatePhotoDTO.imageBase64 = url;
        this.fileService.update(updatePhotoDTO).subscribe(updatedPhotoDTO => {
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
    this.fileService.markPhotoAsDeleted(this.photo.id).subscribe(
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

    const hasreaction = this.photo.reactions.some(
      x => x.userId === this.currentUser.id
    );
    const newReaction: NewLike = {
      photoId: this.photo.id,
      userId: this.currentUser.id
    };
    if (hasreaction) {
      this.fileService.RemoveReactionPhoto(newReaction).subscribe(
        x => {
          this.photo.reactions = this.photo.reactions.filter(
            e => e.userId !== this.currentUser.id
          );
          this.hasUserReaction = false;
        },
        error => this.notifier.notify('error', 'Error removing reaction')
      );
    } else {
      this.fileService.ReactionPhoto(newReaction).subscribe(
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
    xhr.onload = function() {
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
  openModalForPickCoord(event) {}

  CloseInfo() {
    this.isInfoShown = !this.isInfoShown;
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

    this.fileService.sendPhotos(photos).subscribe(
      uploadedPhotos => {
        this.notifier.notify('success', 'Photo saved');
      },
      error => this.notifier.notify('error', 'Error saving photo')
    );
  }
}
