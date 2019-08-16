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
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';

@Component({
  selector: 'app-shared-page-album',
  templateUrl: './shared-page-album.component.html',
  styleUrls: ['./shared-page-album.component.sass']
})
export class SharedPageAlbumComponent implements OnInit {

  @Input() album: ViewAlbum = { } as ViewAlbum;

  sharedAlbum: SharedAlbum = {} as SharedAlbum;
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
    private albumService: AlbumService, private zipService: ZipService, 
	private resolver: ComponentFactoryResolver) 
  { 
    this.decodeUserData();
    
  }

  ngOnInit() {
    let userId: number = 1;//parseInt(localStorage.getItem("userId"));
    this.selectedPhotos = [];
    this.albumService.getAlbum(this.sharedAlbum.albumId).subscribe( x => {this.album = x.body; });
	this.loading = true;
  }

  public photoClicked(eventArgs: PhotoRaw)
  {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    console.log(eventArgs);
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
  
  private decodeUserData() {
    let encodedData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace("___","/"));
    this.sharedAlbum = JSON.parse(jsonData);
  }
}
