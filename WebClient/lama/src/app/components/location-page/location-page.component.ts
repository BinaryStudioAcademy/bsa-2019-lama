import { Component, OnInit, Input } from '@angular/core';
import { LocationServiceService } from 'src/app/services/location-service.service';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NotifierService } from 'angular-notifier';
import { Album } from 'src/app/models/Album/album';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.sass']
})
export class LocationPageComponent implements OnInit {
  constructor(
    private locationService: LocationServiceService,
    private albumService: AlbumService,
    private notifier: NotifierService,
    private router: Router
  ) {}
  ArchivePhotos = [];
  showSpinner = true;
  unsubscribe = new Subject();
  isAnyItems = false;
  @Input() AlbumsViewCities: ViewAlbum[];
  @Input() AlbumsViewCountries: ViewAlbum[];
  albumCities = true;
  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.locationService
      .getUserLocationAlbums(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.AlbumsViewCities = x;
      });
    this.locationService
      .getUserLocationAlbumsByCountry(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.AlbumsViewCountries = x;
        if (this.AlbumsViewCountries.length) {
          this.isAnyItems = true;
        } else {
          this.isAnyItems = false;
        }
        this.showSpinner = false;
      });
  }
  public albumClicked(eventArgs: ViewAlbum) {
    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['/main/location', eventArgs.title], navigationExtras);
  }
  ArchiveAlbum(event: ViewAlbum) {
    if (event.photoAlbums) {
      const NameOfFiles = [];
      for (const item of event.photoAlbums) {
        NameOfFiles.push(item.originalBlobId);
      }
      this.albumService
        .ArchiveAlbum(NameOfFiles)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => {
            this.ArchivePhotos = x;
            this.ConvertToImage(event.title);
          },
          error => this.notifier.notify('error', 'Error archive album')
        );
    } else {
      this.notifier.notify('error', 'Cannot download the empty album');
    }
  }
  ChangeAlbum() {
    this.albumCities = !this.albumCities;
  }
  ConvertToImage(name) {
    const zip = new JSZip();
    for (let i = 0; i < this.ArchivePhotos.length; i++) {
      zip.file(`image${i + 1}.jpg`, this.ArchivePhotos[i], { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, name);
    });
  }
}
