import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { SharedService } from 'src/app/services/shared.service';
import { SharingService } from 'src/app/services/sharing.service';
import { SharedPageDataset } from 'src/app/models/sharedPageDataset';
import {User} from 'firebase';
import { UserService } from 'src/app/services/user.service';
import { Photo } from 'src/app/models';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';

@Component({
  selector: 'app-shared-page-album',
  templateUrl: './shared-page-album.component.html',
  styleUrls: ['./shared-page-album.component.sass']
})
export class SharedPageAlbumComponent implements OnInit {
	
  sharedAlbum: SharedAlbum = <SharedAlbum>{};
  userData: SharedPageDataset;
  authenticatedUser: User;
  sharedLinkData: string;
  album: ViewAlbum = { } as ViewAlbum;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private sharingService: SharingService, private albumService: AlbumService) {

   }


  ngOnInit() {
    this.decodeUserData();
	this.albumService.getAlbum(this.sharedAlbum.albumId).subscribe( x => {this.album = x.body});
	
	
    
  }

  private decodeUserData(){
    let encodedData = this.sharedLinkData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace("___","/"));
	console.log(jsonData);
    this.sharedAlbum = JSON.parse(jsonData);
  }
}
