import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, NgZone } from '@angular/core';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { UpdatePhotoDTO, ImageEditedArgs, MenuItem } from 'src/app/models';
import { FileService } from 'src/app/services';
import { User } from 'src/app/models/User/user';
import { NewLike } from 'src/app/models/Reaction/NewLike';
import * as  bulmaCalendar from 'bulma-calendar';
import { load } from 'piexifjs';
import { MapsAPILoader, MouseEvent } from '@agm/core';

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
  public showSharedModal: boolean = false;
  public showEditModal: boolean = false;

  public clickedMenuItem: MenuItem;
  public shownMenuItems: MenuItem[];

  // events
  @Output()
  public deletePhotoEvenet = new EventEmitter<number>();
  @Output()
  public updatePhotoEvent = new EventEmitter<PhotoRaw>();

  // fields
  private fileService: FileService;

  private defaultMenuItem: MenuItem[];
  private editingMenuItem: MenuItem[];
  private deletingMenuItem: MenuItem[];

  currentUser: User;
  private hasUserReaction: boolean;

  // location
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  // constructors
  constructor(fileService: FileService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    this.isShown = true;

    this.fileService = fileService;

    this.initializeMenuItem();

    this.shownMenuItems = this.defaultMenuItem;
    this.clickedMenuItem = null;
  }

  ngOnInit() {
    const calendars = bulmaCalendar.attach('[type="date"]');
    calendars.forEach(calendar => {
      calendar.on('select', date => {
        // console.log(date);
      });
    });
    let reactions = this.photo.reactions;

    this.hasUserReaction = reactions.some(x => x.userId == parseInt(this.currentUser.id));
    this.GetFile();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

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

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  // GET EXIF

  GetFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.photo.blob256Id, true);
    xhr.onload = function () {

      var response = xhr.responseText;
      var binary = ""

      for (let i = 0; i < response.length; i++) {
        binary += String.fromCharCode(response.charCodeAt(i) & 0xff);
      }

      let src = 'data:image/jpeg;base64,' + btoa(binary);
      let exifObj = load(src);
      let gps = exifObj["GPS"];
      console.log(gps);
    }

    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.send();
  }
  private initializeMenuItem() {
    this.defaultMenuItem =
      [
        { title: "share", icon: "share" },
        { title: "remove", icon: "clear" },
        { title: "download", icon: "cloud_download" },
        { title: "edit", icon: "edit" },
        { title: "info", icon: "info" }
      ];
    this.editingMenuItem =
      [
        { title: "crop", icon: "crop" },
        { title: "rotate", icon: "rotate_left" }
      ];
    this.deletingMenuItem =
      [
        { title: "yes", icon: "done" },
        { title: "no", icon: "remove" }
      ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: MenuItem): void {
    this.clickedMenuItem = clickedMenuItem;


    // share
    if (clickedMenuItem === this.defaultMenuItem[0]) {
      this.openShareModal();
    }

    // remove
    if (clickedMenuItem === this.defaultMenuItem[1]) {
      this.shownMenuItems = this.deletingMenuItem;
    }

    if (clickedMenuItem === this.deletingMenuItem[0])// yes
    {
      this.deleteImage();
    }

    if (clickedMenuItem === this.deletingMenuItem[1])// no
    {
      this.shownMenuItems = this.defaultMenuItem;
    }

    // download

    // edit
    if (clickedMenuItem === this.defaultMenuItem[3]) {
      this.openEditModal();
    }

    // info
    if (clickedMenuItem === this.defaultMenuItem[4]) {
      let element = document.getElementById("info-content");
      element.style.visibility = 'visible';
      element.style.width = "500px";
    }
  }

  public mouseLeftOverlayHandler(): void {
    this.shownMenuItems = this.defaultMenuItem;
  }

  public imageHandler(editedImage: ImageEditedArgs): void {
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: editedImage.originalImageUrl,
      imageBase64: editedImage.croppedImageBase64
    };

    this.fileService.update(updatePhotoDTO)
      .subscribe(updatedPhotoDTO => {
        Object.assign(this.photo, updatedPhotoDTO);
        //  this.updatePhotoEvent.emit(updatePhotoDTO);
        this.goBackToImageView();
      });
  }

  public goBackToImageView(): void {
    this.clickedMenuItem = null;
  }
  protected closeModal(): void {
    this.isShown = false;
  }

  private openShareModal(): void {
    this.showSharedModal = true;
  }

  private openEditModal(): void {
    this.showEditModal = true;
  }

  private deleteImage(): void {
    this.fileService.markPhotoAsDeleted(this.photo.id)
      .subscribe(res => {
        this.closeModal();

        this.deletePhotoEvenet.emit(this.photo.id);
      });
  }
  public ReactionPhoto(event) {

    console.log(this.currentUser);
    if (this.photo.userId === parseInt(this.currentUser.id)) {
      return;
    }
    let hasreaction = this.photo.reactions.some(x => x.userId === parseInt(this.currentUser.id));
    const newReaction: NewLike = {
      photoId: this.photo.id,
      userId: parseInt(this.currentUser.id)
    }
    if (hasreaction) {
      this.fileService.RemoveReactionPhoto(newReaction).subscribe(x => {
        this.photo.reactions = this.photo.reactions.filter(x => x.userId != parseInt(this.currentUser.id));
        this.hasUserReaction = false
      });
    }
    else {
      this.fileService.ReactionPhoto(newReaction).subscribe(x => {
        this.photo.reactions.push({ userId: parseInt(this.currentUser.id) });
        this.hasUserReaction = true;
      });
    }
  }

  forceDownload() {
    let url = this.photo.blobId;
    var fileName = this.photo.blobId;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      var urlCreator = window.URL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
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
  openModalForPickCoord(event) {

  }
}
