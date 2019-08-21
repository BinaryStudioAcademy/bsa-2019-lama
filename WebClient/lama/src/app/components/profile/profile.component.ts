import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthService,
    private httpService: HttpService, 
    private userService: UserService,
    private sharedService: SharedService) {  }


  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultImageUrl: string;


  userForm: FormGroup;
  user: User = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    photo: {imageUrl: '',
    description: ''}
  };
  isSuccesfull: boolean = true;
  photoUrl: string;
  testReceivedUser: User;
  showSpinner: boolean = true;
  isPhotoLoaded: boolean = false;
  isSaved: boolean = false;

  ngOnInit() {
    this.httpService.getData(`users/${localStorage.getItem('userId')}`).subscribe((u) => {
      this.isSuccesfull = true;
      this.user = u;
      this.showSpinner = false;
      this.photoUrl = u.photoUrl;
      this.sharedService.avatar = {imageUrl: u.photoUrl};

      console.log(this.user.lastName);
      this.defaultEmail = this.user.email;
      this.defaultLastName = this.user.lastName;
      this.defaultFirstName = this.user.firstName;
      this.defaultImageUrl = this.user.photoUrl;
    }, err => {
      console.log(err);
      this.showSpinner = false;
      this.isSuccesfull = false;
    });

    this.userForm = new FormGroup({
      'firstName': new FormControl(this.user.firstName, Validators.required),
      'lastName': new FormControl(this.user.lastName, Validators.required),
      'email': new FormControl(this.user.email)
    });
  }

  readURL(event: Event): void {
    this.isPhotoLoaded = true;
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          this.photoUrl = reader.result as string;
          this.user.photo = {imageUrl: this.photoUrl, description: '', authorId: this.user.id}
        }
        reader.readAsDataURL(file);
    }
  }

  async saveUser() {
    if (!this.userForm.dirty && this.defaultImageUrl === this.photoUrl) {
      return;
    }

    console.log(this.photoUrl);
    this.httpService.putData(`users`, this.user).subscribe((data: User) => this.testReceivedUser = data);
    if (this.isPhotoLoaded)
      this.sharedService.avatar = this.user.photo;
    localStorage.setItem('firstName', `${this.user.firstName}`);
    localStorage.setItem('lastName', `${this.user.lastName}`);
    localStorage.setItem('photoUrl', `${this.user.photoUrl}`);
    localStorage.setItem('email', this.user.email)
    this.userService.updateCurrentUser({photoURL: this.photoUrl})
	this.isSaved = true;
  }
  
  closeNotification() {
	this.isSaved = false;
  }

  refresh() {
    this.userForm.setValue(
      {
        firstName: this.defaultFirstName,
        lastName: this.defaultLastName,
        email: this.defaultEmail
      }
    );
    this.photoUrl = this.defaultImageUrl;
  }
  
  removeProfilePhoto() {
	this.photoUrl = null;
	this.user.photo = null;
  }
}
