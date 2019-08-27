import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  DoCheck
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/Album/album';
import { Photo, PhotoRaw } from 'src/app/models';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { element } from 'protractor';
import { ZipService } from 'src/app/services/zip.service';
import { User } from 'src/app/models/User/user';
import { UpdateAlbum } from 'src/app/models/Album/updatedAlbum';
import { NotifierService } from 'angular-notifier';
import { AddPhotosToAlbumModalComponent } from '../add-photos-to-album-modal/add-photos-to-album-modal.component';
import { HttpService } from 'src/app/services/http.service';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass'],
  providers: [FavoriteService, ZipService]
})
export class ViewAlbumComponent implements OnInit, DoCheck {
  @Input() album: ViewAlbum = {} as ViewAlbum;

  favorites: Set<number> = new Set<number>();
  AlbumId: number;
  coverId: number;
  loading = false;
  isDeleting: boolean;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  currentUser: User;

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  @ViewChild('AddPhotosToAlbum', { static: true, read: ViewContainerRef })
  private modaladdPhoto: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private favoriteService: FavoriteService,
    private zipService: ZipService,
    private resolver: ComponentFactoryResolver,
    private notifier: NotifierService,
    private httpService: HttpService
  ) {
    this.routeSubscription = route.params.subscribe(
      params => (this.AlbumId = parseInt(params.id, 10))
    );
    this.route.queryParams.subscribe(
      params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.album = this.router.getCurrentNavigation().extras.state.album;
        }
      },
      error => this.notifier.notify('error', 'Error getting query params')
    );
  }

  ngOnInit() {
    const userId: number = parseInt(localStorage.getItem('userId'), 10);
    this.httpService.getData('users/' + userId).subscribe(
      u => {
        this.currentUser = u;
      },
      error => this.notifier.notify('error', 'Error loading user')
    );
    this.selectedPhotos = [];
    if (this.loading === false && this.AlbumId !== 0) {
      this.albumService.getAlbum(this.AlbumId).subscribe(
        x => {
          this.album = x.body;
        },
        error => this.notifier.notify('error', 'Error loading album')
      );
    } else if (this.AlbumId === 0) {
      this.favoriteService.getFavoritesPhotos(userId).subscribe(
        data => {
          this.album.photoAlbums = data;
          this.album.id = 0;
          this.album.title = 'Favorite photos';
        },
        error =>
          this.notifier.notify('error', 'Error loading favourites photos')
      );
    }
    this.favoriteService.getFavoritesIds(userId).subscribe(
      data => {
        this.favorites = new Set<number>(data);
        this.loading = true;
      },
      error => this.notifier.notify('error', 'Error loading favourites')
    );
    this.coverId = parseInt(localStorage.getItem('favoriteCover'), 10);
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

  addPhoto(eventArgs) {
    let files;
    if (eventArgs) {
      files = eventArgs;
    }
    this.modaladdPhoto.clear();
    const factory = this.resolver.resolveComponentFactory(
      AddPhotosToAlbumModalComponent
    );
    const componentRef = this.modaladdPhoto.createComponent(factory);
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.AlbumId = this.AlbumId;
    componentRef.instance.LoadFile(files);
    componentRef.instance.AddingPhotosToAlbum.subscribe(
      this.AddToAlbumNewPhotos.bind(this)
    );
  }
  AddToAlbumNewPhotos(photos: PhotoRaw[]) {
    if (this.album.photoAlbums === null) {
      this.album.photoAlbums = [];
    }
    this.album.photoAlbums.push(...photos);
  }
  ngDoCheck() {
    this.isAtLeastOnePhotoSelected = this.selectedPhotos.length > 0;
    if (
      this.album.photoAlbums !== null &&
      this.album.photoAlbums !== undefined &&
      this.album.photoAlbums.length === 0
    ) {
      if (this.isFavorite()) {
        localStorage.removeItem('favoriteCover');
      } else {
        this.albumService
          .removeAlbumCover(this.album.id)
          .subscribe(
            x => x,
            error => this.notifier.notify('error', 'Error removing cover')
          );
      }
    }
  }

  photoSelected(eventArgs: PhotoRawState) {
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  deleteImages(): void {
    const indexes = new Array<number>();
    this.selectedPhotos.forEach(e => {
      indexes.push(this.album.photoAlbums.findIndex(i => i.id === e.id));
    });
    indexes.forEach(e => {
      this.album.photoAlbums.splice(e, 1);
    });
    const ids = new Array<number>();
    this.album.photoAlbums.forEach(e => {
      ids.push(e.id);
    });
    if (this.isFavorite()) {
      this.selectedPhotos.forEach(item => {
        this.favoriteService
          .deleteFavorite(parseInt(localStorage.getItem('userId'), 10), item.id)
          .subscribe(
            () => {
              this.favorites.delete(item.id);
            },
            error => this.notifier.notify('error', 'Error deleting favourites')
          );
      });
      if (!this.album.photoAlbums.find(p => p.id === this.coverId)) {
        localStorage.removeItem('favoriteCover');
      }
    } else {
      this.selectedPhotos = [];
      this.albumService.updateAlbum({
        title: this.album.title,
        id: this.album.id,
        photoIds: ids
      });
    }
  }

  downloadImages() {
    this.zipService.downloadImages(this.selectedPhotos);
  }

  deleteWindow() {
    this.isDeleting = true;
  }

  public goBackToImageView(): void {
    this.isDeleting = false;
  }

  isFavorite() {
    return this.AlbumId === 0;
  }
}
