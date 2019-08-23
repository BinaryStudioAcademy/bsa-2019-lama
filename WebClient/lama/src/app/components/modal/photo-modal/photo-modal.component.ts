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
import { UpdatePhotoDTO, ImageEditedArgs, MenuItem } from 'src/app/models';

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

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit {
  // properties
  @Input()
  public photo: PhotoRaw;
  public isShown: boolean;
  public isInfoShown = false;
  public imageUrl: string;
  public userId: number;
  public showSharedModal = false;
  public showSharedByLinkModal = false;
  public showSharedByEmailModal = false;
  albums: PhotoDetailsAlbum[];
  isShowSpinner = true;
  public clickedMenuItem: MenuItem;
  public shownMenuItems: MenuItem[];
  public isEditing: boolean;
  showEditModal: boolean;

  // events
  @Output()
  deletePhotoEvenet = new EventEmitter<number>();
  @Output()
  public updatePhotoEvent = new EventEmitter<PhotoRaw>();
  public hasUserReaction: boolean;

  // fields
  private fileService: FileService;
  private authService: AuthService;
  private userService: UserService;

  private defaultMenuItem: MenuItem[];
  private editingMenuItem: MenuItem[];
  private deletingMenuItem: MenuItem[];

  currentUser: User;

  // location
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  GPS: any;
  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  // constructors
  constructor(
    fileService: FileService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private albumService: AlbumService,
    authService: AuthService,
    userService: UserService,
    private notifier: NotifierService
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
    this.fileService.getPhoto(this.photo.blobId).subscribe(data => {
      this.imageUrl = data;
      this.isShowSpinner = false;
      this.GetFile();
    });
    const calendars = bulmaCalendar.attach('[type="date"]');
    calendars.forEach(calendar => {
      calendar.on('select', date => {
        // console.log(date);
      });
    });
    this.userId = this.authService.getLoggedUserId();
    this.userService.getUser(this.userId).subscribe(
      user => {
        this.currentUser = user;
        const reactions = this.photo.reactions;

        this.hasUserReaction = reactions.some(
          x => x.userId === this.currentUser.id
        );
      },
      error => this.notifier.notify('error', 'Error getting user')
    );
    this.albumService
      .GetPhotoDetailsAlbums(this.photo.id)
      .subscribe(
        e => (this.albums = e.body),
        error => this.notifier.notify('error', 'Error loading albums')
      );
  }

  ConvertDMSToDD(
    degrees: number,
    minutes: number,
    seconds: number,
    direction
  ): number {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }
  // Get Current Location Coordinates

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      }
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
    const field = 'GPS';
    const GPS = exifObj[field];

    if (exifObj[field][1] === 'N') {
      this.latitude = this.ConvertDMSToDD(
        exifObj[field][2][0][0],
        exifObj[field][2][1][0],
        exifObj[field][2][2][0] / exifObj[field][2][2][1],
        exifObj[field][1]
      );

      this.longitude = this.ConvertDMSToDD(
        exifObj[field][4][0][0],
        exifObj[field][4][0][0],
        exifObj[field][4][0][0] / exifObj[field][4][2][1],
        exifObj[field][3]
      );

      // load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            // this.latitude = position.coords.latitude;
            // this.longitude = position.coords.longitude;
            this.zoom = 8;
            this.getAddress(this.latitude, this.longitude);
          });
        }
        // tslint:disable-next-line: new-parens
        this.geoCoder = new google.maps.Geocoder();

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
      });
    }
  }
  private initializeMenuItem() {
    this.defaultMenuItem = [
      { title: 'share', icon: 'share' },
      { title: 'remove', icon: 'clear' },
      { title: 'download', icon: 'cloud_download' },
      { title: 'edit', icon: 'edit' },
      { title: 'info', icon: 'info' }
    ];
    this.editingMenuItem = [
      { title: 'crop', icon: 'crop' },
      { title: 'rotate', icon: 'rotate_left' }
    ];
    this.deletingMenuItem = [
      { title: 'yes', icon: 'done' },
      { title: 'no', icon: 'remove' }
    ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: MenuItem): void {
    this.clickedMenuItem = clickedMenuItem;

    console.log(clickedMenuItem);
    // share
    if (clickedMenuItem === this.defaultMenuItem[0]) {
      this.openShareModal();
    }

    // remove
    if (clickedMenuItem === this.defaultMenuItem[1] && this.isEqualId()) {
      this.shownMenuItems = this.deletingMenuItem;
    }

    if (clickedMenuItem === this.deletingMenuItem[0]) {
      this.deleteImage();
    }

    if (clickedMenuItem === this.deletingMenuItem[1]) {
      this.shownMenuItems = this.defaultMenuItem;
    }

    // download

    // edit
    if (clickedMenuItem === this.defaultMenuItem[3]) {
      this.isEditing = true;
    }

    // info
    if (clickedMenuItem === this.defaultMenuItem[4]) {
      this.CloseInfo();
    }
  }

  public mouseLeftOverlayHandler(): void {
    this.shownMenuItems = this.defaultMenuItem;
  }

  public saveEditedImageHandler(editedImage: ImageEditedArgs): void {
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
      },
      error => this.notifier.notify('error', 'Error updating photo')
    );
  }

  resetImageHandler(): void {
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: this.imageUrl,
      imageBase64: ''
    };

    this.fileService.resetToDefault(updatePhotoDTO).subscribe(
      updatedPhotoDTO => {
        console.log(updatedPhotoDTO);
        Object.assign(this.photo, updatedPhotoDTO);
        this.fileService
          .getPhoto(this.photo.originalBlobId)
          .subscribe(url => (this.imageUrl = url));
        this.updatePhotoEvent.emit(this.photo);
        this.goBackToImageView();
        this.notifier.notify('success', 'Photo reseted');
      },
      error => this.notifier.notify('error', 'Error reseting photo')
    );
  }

  public goBackToImageView(): void {
    this.isEditing = false;
  }
  public closeModal(): void {
    this.isShown = false;
  }

  private openShareModal(): void {
    this.showSharedModal = !this.showSharedModal;
  }

  private openEditModal(): void {
    this.showEditModal = true;
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
        this.deletePhotoEvenet.emit(this.photo.id);
        this.notifier.notify('success', 'Photo deleted');
      },
      error => this.notifier.notify('error', 'Error deleting image')
    );
  }
  public ReactionPhoto() {
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

  public isEqualId(): boolean {
    return this.photo.userId === this.userId;
  }
}
