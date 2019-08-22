import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
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
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-main-albums-container',
  templateUrl: './main-albums-container.component.html',
  styleUrls: ['./main-albums-container.component.sass'],
  providers: [FavoriteService]
})
export class MainAlbumsContainerComponent implements OnInit {
  @ViewChild('CreateAlbumnContainer', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  @Input() albums: ViewAlbum[];
  currentUser: User;
  favorite: ViewAlbum = null;
  showFavorite = false;

  ArchivePhotos = [];
  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.httpService.getData('users/' + userId).subscribe(
      u => {
        this.currentUser = u;
        this.GetFavoriteAlbum(this.currentUser.id);
        this.GetAlbums();
      },
      error => this.notifier.notify('error', 'Error loading user')
    );
  }

  // constructors
  constructor(
    resolver: ComponentFactoryResolver,
    private router: Router,
    private albumService: AlbumService,
    private httpService: HttpService,
    private favoriteService: FavoriteService,
    private notifier: NotifierService
  ) {
    this.resolver = resolver;
  }

  GetAlbums() {
    const id = this.currentUser.id;
    this.albumService.getAlbums(id).subscribe(
      albums => {
        this.albums = albums.body;
        this.albums.forEach(a => {
          if (
            a.photo == null &&
            a.photoAlbums != null &&
            a.photoAlbums.length > 0
          ) {
            a.photo = a.photoAlbums[0];
          }
        });
      },
      error => this.notifier.notify('error', 'Error loading albums')
    );
  }

  GetFavoriteAlbum(userId: number) {
    this.favoriteService.getFavoritesPhotos(userId).subscribe(
      data => {
        if (data.length !== 0) {
          this.showFavorite = true;
          this.favorite = {} as ViewAlbum;
          this.favorite.photoAlbums = data;
          this.favorite.id = 0;
          this.favorite.title = 'Favorite photos';
          const cover = localStorage.getItem('favoriteCover');
          let photo: PhotoRaw = null;
          const length: number = this.favorite.photoAlbums.length;
          if (cover == null) {
            photo = this.favorite.photoAlbums[length - 1];
          } else {
            photo = this.favorite.photoAlbums.find(
              f => f.id === parseInt(cover, 10)
            );
            if (photo == null) {
              photo = this.favorite.photoAlbums[0];
            } else {
              this.favorite.photo = photo;
            }
          }
          this.favorite.photo = photo;
          this.showFavorite = true;
        }
      },
      error => this.notifier.notify('error', 'Error loading favourite albums')
    );
  }

  CreateAlbum(event) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(
      CreateAlbumModalComponent
    );
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.createdAlbumEvent.subscribe(
      (createdAlbums: CreatedAlbumsArgs) => {
        if (createdAlbums.photoUrl !== null) {
          this.albums.push({
            id: createdAlbums.id,
            name: createdAlbums.name,
            title: createdAlbums.name,
            photo: {
              blob256Id: createdAlbums.photoUrl,
              blobId: createdAlbums.photoUrl,
              reactions: []
            },
            photoAlbums: []
          });
        } else {
          this.albums.push({
            id: createdAlbums.id,
            name: createdAlbums.name,
            title: createdAlbums.name,
            photo: null,
            photoAlbums: null
          });
        }
      }
    );
  }

  ArchiveAlbum(event: ViewAlbum) {
    this.albumService.ArchiveAlbum(event.photoAlbums).subscribe(
      x => {
        this.ArchivePhotos = x;
        this.ConvertToImage(event.title);
      },
      error => this.notifier.notify('error', 'Error archive album')
    );
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
  // methods
  public albumClicked(eventArgs: Album) {
    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['/main/album', eventArgs.id], navigationExtras);
  }
  public deleteAlbumHandler(albumToDelete: ViewAlbum) {
    if (albumToDelete.id === 0) {
      this.showFavorite = false;
      localStorage.removeItem('favoriteCover');
    } else {
      this.albums = this.albums.filter(a => a !== albumToDelete);
    }
  }
}
