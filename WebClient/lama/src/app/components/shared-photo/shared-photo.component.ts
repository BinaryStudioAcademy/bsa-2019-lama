import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';

@Component({
  selector: 'app-shared-photo',
  templateUrl: './shared-photo.component.html',
  styleUrls: ['./shared-photo.component.sass']
})
export class SharedPhotoComponent implements OnInit {

  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  photoDocument:PhotoRaw = <PhotoRaw>{};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.decodeUserData();

  }

  private decodeUserData(){
    let encodedData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace("___","/"));
    this.sharedPhoto = JSON.parse(jsonData);
  }



}
