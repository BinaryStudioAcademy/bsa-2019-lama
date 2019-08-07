import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.sass']
})
export class ViewAlbumComponent implements OnInit {

  private name: number;
  private imageUrl: string;
   
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  constructor(private route: ActivatedRoute) { 

    this.routeSubscription = route.params.subscribe(params=>this.name=params['name']);
    this.querySubscription = route.queryParams.subscribe(
        (queryParam: any) => {
            this.imageUrl = queryParam['imageUrl'];
        }
    );
  }

  ngOnInit() {
  }

}
