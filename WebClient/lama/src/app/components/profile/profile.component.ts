import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthService, 
    private httpService: HttpService, 
    private userService: UserService) {  }
  
  userForm: FormGroup;
  user: User = {
    email: localStorage.getItem('email'),
    firstName: localStorage.getItem('fistName'),
    lastName: localStorage.getItem('lastName'),
    avatarUrl: localStorage.getItem('photoUrl')
  };
  photoUrl: string;
  testReceivedUser: User;

  ngOnInit() {
    this.photoUrl = this.authService.afAuth.auth.currentUser.photoURL;
    this.user.id = parseInt(localStorage.getItem('userId'));
    this.httpService.getData(`users/${this.user.id}`).subscribe((data:User) => this.user = data);
	
	
    this.userForm = new FormGroup({
      'firstName': new FormControl(this.user.firstName),
      'lastName': new FormControl(this.user.lastName),
      'email': new FormControl(this.user.email)
    });
  }

  readURL(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.photoUrl = reader.result as string;

        reader.readAsDataURL(file);

        this.userService.updateCurrentUser({photoURL: this.photoUrl})
    }
  }

  async saveUser() {
	this.httpService.putData(`users`, this.user).subscribe((data:User) => this.testReceivedUser = data);
  }
}
