import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, DoCheck } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/Album/album';
import { Photo, PhotoRaw } from 'src/app/models';
import {PhotoRawState} from 'src/app/models/Photo/photoRawState';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { element } from 'protractor';
import { ZipService } from 'src/app/services/zip.service';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { User } from 'src/app/models/User/user';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass'],
  providers: [FavoriteService, ZipService]
})
export class ViewAlbumComponent implements OnInit, DoCheck {


  @Input() album: ViewAlbum = { } as ViewAlbum;

  favorites: Set<number> = new Set<number>();
  AlbumId: number;
  loading: boolean = false;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  currentUser: User;
  
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  constructor(private route: ActivatedRoute, private router: Router,
    private albumService: AlbumService, private favoriteService: FavoriteService,
    private zipService: ZipService, private resolver: ComponentFactoryResolver) 
  { 
    this.routeSubscription = route.params.subscribe(params => this.AlbumId = params['id']);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.album = this.router.getCurrentNavigation().extras.state.album;
      }
    });
  }

  ngOnInit() {
    let userId: number = parseInt(localStorage.getItem("userId"));
    this.selectedPhotos = [];
    if (this.loading === false && this.AlbumId != 0) {
      this.albumService.getAlbum(this.AlbumId).subscribe( x => {this.album = x.body; });
    } else if(this.AlbumId == 0) {     
      this.favoriteService.getFavoritesPhotos(userId)
          .subscribe(data => {
            this.album.photoAlbums = data;
            this.album.id = 0;
            this.album.title = "Favorite photos";
          })
    }
    this.favoriteService.getFavoritesIds(userId).subscribe(data => { this.favorites = new Set<number>(data); this.loading = true;});
  }

  public photoClicked(eventArgs: PhotoRaw)
  {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvenet.subscribe(this.deletePhotoHandler.bind(this));
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent.subscribe(this.updatePhotoHandler.bind(this));
  }
  
  public deletePhotoHandler(photoToDeleteId: number): void
  {
    this.album.photoAlbums = this.album.photoAlbums.filter(p => p.id !== photoToDeleteId);
  }

  public updatePhotoHandler(updatedPhoto: PhotoRaw): void
  {
    const index = this.album.photoAlbums.findIndex(i => i.id === updatedPhoto.id);
    this.album.photoAlbums[index] = updatedPhoto
  }
  
  ngDoCheck() {
    this.isAtLeastOnePhotoSelected = this.selectedPhotos.length > 0
  }

  public photoSelected(eventArgs: PhotoRawState)
  {
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  public deleteImages(): void {
    const indexes = new Array<number>();
    this.selectedPhotos.forEach(element => {
      indexes.push(this.album.photoAlbums.findIndex(i => i.id === element.id));
    });
    indexes.forEach(element => {
      this.album.photoAlbums.splice(element, 1);
    });
    const ids = new Array<number>();
    this.album.photoAlbums.forEach(element => {
      ids.push(element.id);
    });
    if (this.AlbumId == 0) {
      this.selectedPhotos.forEach(item => {
        this.favoriteService.deleteFavorite(parseInt(localStorage.getItem('userId')), item.id).subscribe(() => {
          this.favorites = new Set<number>();
        });
      });
    }
    this.selectedPhotos = [];
    this.albumService.updateAlbum({
      title: this.album.title,
      id: this.album.id,
      photoIds: ids
    });
  }

  public downloadImages() {
    this.zipService.downloadImages(this.selectedPhotos);
  }
}
