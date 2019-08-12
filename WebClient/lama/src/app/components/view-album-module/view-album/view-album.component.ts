import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/Album/album';
import { Photo } from 'src/app/models';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass']
})
export class ViewAlbumComponent implements OnInit {


  @Input() album: ViewAlbum = { } as ViewAlbum;

  AlbumId: number;
  loading : boolean = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,private albumService:AlbumService) 
  { 
    this.routeSubscription = route.params.subscribe(params=>this.AlbumId=params['id']);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.album = this.router.getCurrentNavigation().extras.state.album;
      }
    });
  }

  ngOnInit() {
    if (this.loading === false) {
      this.albumService.getAlbum(this.AlbumId).subscribe( x => {this.album = x.body; this.loading = true; });
    }
  }

}
