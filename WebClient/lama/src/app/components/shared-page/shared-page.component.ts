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
import { Subject } from 'rxjs';


@Component({
  selector: 'app-shared-page',
  templateUrl: './shared-page.component.html',
  styleUrls: ['./shared-page.component.sass']
})
export class SharedPageComponent implements OnInit {

  sharedPhoto: SharedPhoto = {} as SharedPhoto;
  userSubject: Subject<any> = new Subject<any>();
  authenticatedUser: User;
  sharedLinkData: string;
  updatedPhoto: PhotoRaw = {} as PhotoRaw;
  userData: SharedPageDataset;

  constructor(private userService: UserService, private router: Router,
              private route: ActivatedRoute, private sharingService: SharingService) {
   }


  ngOnInit() {
    this.decodeUserData();
    this.sendSharingData();
    this.sharingService.updatePhotoEntityWithSharedLink(this.sharedPhoto.photoId, this.sharedLinkData).subscribe(updated => {
      this.updatedPhoto = updated;
      console.log(this.updatedPhoto.sharedLink);

    });
    this.getUserData();

  }

  private getUserData() {
    this.sharingService.getSharingPageUserData(this.sharedPhoto.photoId).subscribe(
      shareData => {this.userSubject.next(shareData); },
       error => {console.log(error); });

    this.userSubject.subscribe(data => this.userData = data);
  }

  private sendSharingData() {
    this.sharingService.sendSharedPhoto(this.sharedPhoto).subscribe(x => x);
  }

  private decodeUserData() {
    const encodedData = this.sharedLinkData = this.route.snapshot.params.userdata as string;
    const jsonData = atob(encodedData.replace('___', '/'));
    this.sharedPhoto = JSON.parse(jsonData);
  }



}
