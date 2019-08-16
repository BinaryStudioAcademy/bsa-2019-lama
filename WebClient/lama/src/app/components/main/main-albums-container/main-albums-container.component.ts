import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Album } from 'src/app/models/Album/album';
import { CreateAlbumModalComponent } from '../../create-album-module/create-album-modal/create-album-modal.component';
import { Router, NavigationExtras } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';
import { User } from 'src/app/models/User/user';
import { HttpService } from 'src/app/services/http.service';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw, CreatedAlbumsArgs } from 'src/app/models';

import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-main-albums-container',
  templateUrl: './main-albums-container.component.html',
  styleUrls: ['./main-albums-container.component.sass'],
  providers: [FavoriteService]
})
export class MainAlbumsContainerComponent implements OnInit {

  @Input() albums: ViewAlbum[];
  currentUser : User;
  favorite: ViewAlbum = null;

  ArchivePhotos = [];
  ngOnInit() {
    let userId = parseInt(localStorage.getItem('userId'));
    this.httpService.getData('users/'+userId).subscribe((u) => {
      this.currentUser = u; this.GetAlbums();
      this._favoriteService.getFavoritesPhotos(userId).subscribe(data => {
        if(data.length != 0){
          this.favorite = { } as ViewAlbum;
          this.favorite.photoAlbums = data;
          this.favorite.id = 0;
          this.favorite.title = "Favorite photos";
          this.favorite.photo = this.favorite.photoAlbums[0];
        }
      });
    });
  }


  @ViewChild('CreateAlbumnContainer', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  // constructors
  constructor(resolver: ComponentFactoryResolver, private router: Router, private albumService: AlbumService,
    private httpService: HttpService, private _favoriteService: FavoriteService) {
    this.resolver = resolver;
  }

  GetAlbums() {
    let id =  this.currentUser.id;
    this.albumService.getAlbums(id).subscribe(albums => {this.albums = albums.body;});
  }

  public CreateAlbum(event) {
     this.entry.clear();
     const factory = this.resolver.resolveComponentFactory(CreateAlbumModalComponent);
     const componentRef = this.entry.createComponent(factory);
     componentRef.instance.currentUser = this.currentUser;
     componentRef.instance.createdAlbumEvent.subscribe((createdAlbums: CreatedAlbumsArgs) =>
     {
        this.albums.push({
          id: createdAlbums.id,
          name: createdAlbums.name,
          title: createdAlbums.name,
          photo:
          {
            blob256Id: createdAlbums.photoUrl,
            blobId: createdAlbums.photoUrl,
            reactions: [],
          },
          photoAlbums: []
        });
     });
  }
  ArchiveAlbum(event: ViewAlbum)
  {
    this.albumService.ArchiveAlbum(event.photoAlbums).subscribe( x =>  {this.ArchivePhotos = x; this.ConvertToImage(event.title)});
  }
  ConvertToImage(name) {

    var zip = new JSZip();
    for(let i =0;i<this.ArchivePhotos.length;i++)
    zip.file(`image${i+1}.jpg`, this.ArchivePhotos[i], {base64: true});


    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, name);
    });
  }
  // methods
  public albumClicked(eventArgs: Album) {

    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['/main/album',eventArgs.id], navigationExtras);
  }
  public deleteAlbumHandler(albumToDelete: ViewAlbum)
  {
    this.albums = this.albums.filter(a => a !== albumToDelete);
  }
}
