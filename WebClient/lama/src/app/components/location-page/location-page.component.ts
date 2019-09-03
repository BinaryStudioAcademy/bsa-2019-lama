import { Component, OnInit } from '@angular/core';
import { LocationServiceService } from 'src/app/services/location-service.service';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.sass']
})
export class LocationPageComponent implements OnInit {
  constructor(private locationService: LocationServiceService) {}

  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.locationService
      .getUserLocationAlbums(userId)
      .subscribe(x => console.log(x));
    this.locationService
      .getUserLocationAlbumsByCountry(userId)
      .subscribe(x => console.log(x));
  }
}
