import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { SharedService } from 'src/app/services/shared.service';
import { SharingService } from 'src/app/services/sharing.service';
import { SharedPageDataset } from 'src/app/models/sharedPageDataset';
import {User} from 'firebase';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-shared-page',
  templateUrl: './shared-page.component.html',
  styleUrls: ['./shared-page.component.sass']
})
export class SharedPageComponent implements OnInit {

  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  userData: SharedPageDataset;
  authenticatedUser: User;
  sharedLinkData: string;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private sharingService: SharingService) {

   }

  ngOnInit() {



    this.decodeUserData();
    this.sharingService.getSharingPageUserData(this.sharedPhoto.photoId).subscribe(shareData => {
      this.userData = shareData;
    })

    //Session is not saved properly yet, so method returns no user
    //this.userService.getCurrentUser().then(user  => this.authenticatedUser = user);

    //No proper data in database yet, so we are not updating
    //this.sharingService.updatePhotoEntityWithSharedLink(this.sharedPhoto.photoId,this.sharedLinkData);
  }

  private decodeUserData(){
    let encodedData = this.sharedLinkData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace("___","/"));
    this.sharedPhoto = JSON.parse(jsonData);
  }



}
