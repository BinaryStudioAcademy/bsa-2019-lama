import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  photoUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  notifications: boolean;

  ngOnInit() {
  }

  readURL(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.photoUrl = reader.result as string;;

        reader.readAsDataURL(file);
    }
  }
}
