import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { NotifierService } from 'angular-notifier';
import { PhotoRaw, User } from 'src/app/models';
import { ZipService } from 'src/app/services/zip.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { takeUntil } from 'rxjs/operators';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { HttpService } from 'src/app/services/http.service';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { LocationServiceService } from 'src/app/services/location-service.service';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.sass']
})
export class ViewLocationComponent implements OnInit, OnDestroy {
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  private routeSubscription: Subscription;
  @Input() album: ViewAlbum = {} as ViewAlbum;
  AlbumName: string;
  isAtLeastOnePhotoSelected = false;
  selectedPhotos: PhotoRaw[];
  loading = false;
  albumCities = false;
  currentUser: User;
  unsubscribe = new Subject();
  favorites: Set<number> = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService,
    private zipService: ZipService,
    private resolver: ComponentFactoryResolver,
    private favoriteService: FavoriteService,
    private httpService: HttpService,
    private locationService: LocationServiceService
  ) {
    this.routeSubscription = route.params.subscribe(params => {
      this.AlbumName = params.id;
    });
    this.route.queryParams.subscribe(
      params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.album = this.router.getCurrentNavigation().extras.state.album;
          this.loading = true;
        } else {
          const id = this.AlbumName.indexOf(',');
          if (id === -1) {
            this.albumCities = true;
          }
        }
      },
      error => this.notifier.notify('error', 'Error getting query params')
    );
  }

  ngOnInit() {
    const userId: number = parseInt(localStorage.getItem('userId'), 10);
    this.favoriteService
      .getFavoritesIds(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          this.favorites = new Set<number>(data);
          this.loading = true;
        },
        error => this.notifier.notify('error', 'Error loading favourites')
      );
    this.httpService.getData('users/' + userId).subscribe(
      u => {
        this.currentUser = u;
      },
      error => this.notifier.notify('error', 'Error loading user')
    );
    this.selectedPhotos = [];
    if (this.albumCities === true) {
      this.locationService
        .getUserLocationAlbumsByCountry(userId)
        .subscribe(albums => {
          for (const alb of albums) {
            if (alb.title === this.AlbumName) {
              this.album = alb;
              break;
            }
          }
        });
    } else {
      this.locationService.getUserLocationAlbums(userId).subscribe(albums => {
        for (const alb of albums) {
          if (alb.title === this.AlbumName) {
            this.album = alb;
            break;
          }
        }
      });
    }
  }

  downloadImages() {
    if (!this.isAtLeastOnePhotoSelected) {
      Object.assign(this.selectedPhotos, this.album.photoAlbums);
    }
    this.zipService.downloadImages(this.selectedPhotos);
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
  photoClicked(eventArgs: PhotoRaw) {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvent.subscribe(
      this.deletePhotoHandler.bind(this)
    );
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent.subscribe(
      this.updatePhotoHandler.bind(this)
    );
  }
  deletePhotoHandler(photoToDeleteId: number) {
    this.album.photoAlbums = this.album.photoAlbums.filter(
      p => p.id !== photoToDeleteId
    );
  }

  deletePhotosHandler(photosToDelete: number[]) {
    for (const p of photosToDelete) {
      this.deletePhotoHandler(p);
    }
  }
  updatePhotoHandler(updatedPhoto: PhotoRaw) {
    const index = this.album.photoAlbums.findIndex(
      i => i.id === updatedPhoto.id
    );
    this.album.photoAlbums[index] = updatedPhoto;
  }
  photoSelected(eventArgs: PhotoRawState) {
    console.log(eventArgs);
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }
}
