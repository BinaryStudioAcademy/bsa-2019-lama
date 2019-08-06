import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  photo_url: string;
  firstName: string;
  lastName: string;
  email: string;
  notifications: boolean;

  ngOnInit() {
  }

}
