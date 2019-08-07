import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharingUserData } from 'src/app/models/User/SharingUserData';

@Component({
  selector: 'app-shared-photo',
  templateUrl: './shared-photo.component.html',
  styleUrls: ['./shared-photo.component.sass']
})
export class SharedPhotoComponent implements OnInit {

  userData: SharingUserData;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let encodedData = this.route.snapshot.params.userData;
    let jsonData = atob(encodedData);
    this.userData = JSON.parse(jsonData);
  }



}
