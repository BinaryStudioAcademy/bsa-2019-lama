import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/Album/album';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass']
})
export class ViewAlbumComponent implements OnInit {


  @Input() album: Album;
   
  private routeSubscription: Subscription;
  private querySubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) 
  { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.album = this.router.getCurrentNavigation().extras.state.album;
      }
    });
  }

  ngOnInit() {
  }

}