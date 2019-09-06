import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { PhotoRaw } from 'src/app/models';
import { NewLocation } from 'src/app/models/Photo/NewLocation';
import {
  getLocation,
  getLatitude,
  getLongitude,
  getFormattedAddress,
  getShortAddress
} from 'src/app/export-functions/exif';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.sass']
})
export class GoogleMapComponent implements OnInit {
  latitude: number;
  longitude: number;
  zoom: number;
  checkForm = true;
  address: string;
  shortAddress: string;
  private geoCoder;
  displaymap = false;
  @Output() Deletelocation = new EventEmitter();
  @Output() Updatelocation = new EventEmitter<NewLocation>();

  @Input() photo: PhotoRaw;

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      if (
        this.photo.coordinates !== undefined &&
        this.photo.coordinates !== null
      ) {
        this.setCurrentLocation();
      }
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['geocode']
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          this.displaymap = true;
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          this.shortAddress = getShortAddress(place);
          // verify result
          this.checkForm = true;
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  private setCurrentLocation() {
    const coord = this.photo.coordinates.split(',');
    if (coord[0] && coord[1]) {
      const lat = parseFloat(coord[0]);
      const long = parseFloat(coord[1]);
      this.latitude = lat;
      this.longitude = long;
      this.zoom = 8;
      this.displaymap = true;
      this.getAddress(this.latitude, this.longitude);
    }
  }
  Change() {
    const input = document.getElementById('Input') as HTMLInputElement;
    input.value = '';
    this.address = '';
  }
  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  ChangeLocation() {
    if (this.address === '' || this.address === undefined) {
      this.checkForm = false;
      return;
    }
    const newLoc: NewLocation = {
      id: this.photo.id,
      location: this.address,
      coordinates: `${this.latitude},${this.longitude}`,
      shortLocation: this.shortAddress
    };
    this.checkForm = true;
    this.Updatelocation.emit(newLoc);
  }
  DeleteLocation() {
    this.checkForm = true;
    this.Deletelocation.emit();
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
            this.shortAddress = getShortAddress(results[0]);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }
}
