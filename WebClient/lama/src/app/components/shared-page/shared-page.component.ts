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

  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  userData: Subject<any> = new Subject<any>();
  authenticatedUser: User;
  sharedLinkData: string;
  updatedPhoto: PhotoRaw =<PhotoRaw>{};
  data: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private sharingService: SharingService) {

   }


  ngOnInit() {
    this.decodeUserData();
    this.sendSharingData();

    //TODO receive user data for shared page (e.g photo author, photo's likes, comments)


    //No proper data in database yet, so we are not updating
    this.sharingService.updatePhotoEntityWithSharedLink(this.sharedPhoto.photoId, this.sharedLinkData).subscribe(updated => {
      this.updatedPhoto = updated
      console.log(this.updatedPhoto.sharedLink);

    });
    this.checkSubjectData();
  }

  private checkSubjectData(){
    this.sharingService.getSharingPageUserData(this.sharedPhoto.photoId).subscribe(
      shareData => {this.userData.next(shareData);},
       error => {console.log(error)});

    this.userData.subscribe(data => this.data = data);
  }

  private sendSharingData() {
    this.sharingService.sendSharedPhoto(this.sharedPhoto).subscribe(x => x);
  }

  private decodeUserData(){
    let encodedData = this.sharedLinkData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace("___","/"));
    this.sharedPhoto = JSON.parse(jsonData);
  }



}
