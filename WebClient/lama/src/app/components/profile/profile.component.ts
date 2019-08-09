import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';

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
  user: any = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email'
  };;
  photoUrl: string;
  testReceivedUser: User;
  showSpinner: boolean = true;

  ngOnInit() {
    this.httpService.getData(`users/${localStorage.getItem('userId')}`).subscribe((u) => {
    
      this.user = u;
      this.showSpinner = false;
    });
	
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
    localStorage.setItem('firstName', `${this.user.firstName}`);
    localStorage.setItem('lastName', `${this.user.lastName}`);
    localStorage.setItem('photoUrl', `${this.user.avatarUrl}`);
    localStorage.setItem('email', this.user.email)
  }
}
