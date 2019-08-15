import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/Album/album';
import { Photo, PhotoRaw } from 'src/app/models';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass'],
  providers: [FavoriteService]
})
export class ViewAlbumComponent implements OnInit {


  @Input() album: ViewAlbum = { } as ViewAlbum;

  favorites: Set<number>;
  AlbumId: number;
  loading : boolean = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,private albumService:AlbumService, private _favoriteService: FavoriteService) 
  { 
    this.routeSubscription = route.params.subscribe(params=>this.AlbumId=params['id']);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.album = this.router.getCurrentNavigation().extras.state.album;
      }
    });
  }

  ngOnInit() {
    let userId: number = parseInt(localStorage.getItem("userId"));
    if (this.loading === false && this.AlbumId !=0) {
      this.albumService.getAlbum(this.AlbumId).subscribe( x => {this.album = x.body; });
    }
    else if(this.AlbumId ==0){     
      this._favoriteService.getFavoritesPhotos(userId)
          .subscribe(data => {
            this.album.photoAlbums = data;
            this.album.id = 0;
            this.album.title = "Favorite photos";
          })
    }
    this._favoriteService.getFavoritesIds(userId).subscribe(data => { this.favorites = new Set<number>(data); this.loading = true;});
  }

  public photoClicked(eventArgs: PhotoRaw)
  {

  }

}
