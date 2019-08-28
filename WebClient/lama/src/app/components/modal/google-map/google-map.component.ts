import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Output,
  EventEmitter
} from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.sass']
})
export class GoogleMapComponent implements OnInit {
  title = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  displaymap = false;
  @Output() Deletelocation = new EventEmitter();
  @Output() Updatelocation = new EventEmitter<string>();

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          this.displaymap = true;
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          // verify result
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
  Change() {
    const input = document.getElementById('Input') as HTMLInputElement;
    input.value = '';
  }
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  ChangeLocation() {
    this.Updatelocation.emit(this.address);
  }
  DeleteLocation() {
    this.Deletelocation.emit();
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
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
      }
    );
  }
}