import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  DoCheck,
  OnDestroy
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
import { HttpService } from 'src/app/services/http.service';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileService } from 'src/app/services';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-shared-page-album',
  templateUrl: './shared-page-album.component.html',
  styleUrls: ['./shared-page-album.component.sass']
})
export class SharedPageAlbumComponent implements OnInit, DoCheck, OnDestroy {
  @Input() album: ViewAlbum = {} as ViewAlbum;
  @Input() isShared = false;

  favorites: Set<number> = new Set<number>();
  AlbumId: number;
  isTitleEdit: boolean;
  coverId: number;
  loading = false;
  isDeleting: boolean;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  currentUser: User;
  isFakeAlbum = false;
  returnPath: string;
  unsubscribe = new Subject();
  showSetCoverModal: boolean;
  showSharedModal: boolean;
  sharedAlbumId: number;

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
    private fileService: FileService,
    private resolver: ComponentFactoryResolver,
    private notifier: NotifierService,
    private httpService: HttpService,
    private sharingService: SharingService
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
    this.decodeUserData();
    this.returnPath = this.router.url.substr(
      0,
      this.router.url.lastIndexOf('/') + 1
    );
    const userId: number = parseInt(localStorage.getItem('userId'), 10);
    this.selectedPhotos = [];
    if (this.loading === false && this.AlbumId !== 0 && this.AlbumId !== -1) {
      this.sharingService
        .getSharedAlbumPhotos(this.AlbumId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => {
            this.album = x;
            if (this.album.photoAlbums !== null) {
              this.album.photoAlbums = this.album.photoAlbums.reverse();
            }
            this.loading = true;
          },
          error => this.notifier.notify('error', 'Error loading album')
        );
    } else if (this.AlbumId === -1) {
      this.isFakeAlbum = true;
    }
    this.returnPath = this.router.url.substr(
      0,
      this.router.url.lastIndexOf('/') + 1
    );
    if (this.returnPath === '/main/shared/') {
      this.isShared = true;
    }
  }

  photoClicked(eventArgs: PhotoRaw) {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.currentUser = this.currentUser;
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
      } else if (this.album.photo) {
        this.album.photo = null;
        this.albumService
          .removeAlbumCover(this.album.id)
          .pipe(takeUntil(this.unsubscribe))
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

  downloadImages() {
    if (!this.isAtLeastOnePhotoSelected) {
      this.zipService.downloadImages(this.album.photoAlbums);
    } else {
      this.zipService.downloadImages(this.selectedPhotos);
    }
  }

  async savePhotos() {
    const photos = new Array<Photo>();
    if (this.isAtLeastOnePhotoSelected) {
      this.selectedPhotos.forEach(el => {
        photos.push(this.createPhoto(el, null));
      });
    } else {
      this.album.photoAlbums.forEach(el => {
        this.fileService
          .getPhoto(el.blobId)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(data => {
            photos.push(this.createPhoto(el, data));
          });
      });
    }
    await this.delay(2000);
    this.fileService
      .sendPhotos(photos)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        uploadedPhotos => {
          this.notifier.notify('success', 'Photos saved');
        },
        error => this.notifier.notify('error', 'Error saving photos')
      );
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isFavorite() {
    return this.AlbumId === 0;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  createPhoto(ph: PhotoRaw, url: string): Photo {
    return {
      imageUrl: url,
      description: ph.description,
      authorId: this.currentUser.id,
      filename: ph.name,
      location: ph.location
    };
  }

  decodeUserData() {
    const encodedData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace('___', '/'));
    jsonData = jsonData.replace('[]', '');
    this.AlbumId = JSON.parse(jsonData).albumId;
  }
}
