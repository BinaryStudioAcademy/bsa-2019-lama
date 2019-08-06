import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.sass']
})
export class AuthModalComponent implements OnInit {

  @Output() onClose = new EventEmitter();

  userProfileData: string;
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public tryGoogleLogin(){
    console.log("try login google called");
    this.authService.loginWithGoogle()
    .then(res => {
      this.router.navigate(['/login']);
    })
  }

  public tryTwitterLogin(){
    this.authService.loginWithTwitter()
    .then(res => {
      this.router.navigate(['/login']);
    })
  }

  public tryFacebookLogin(){
    this.authService.loginWithFacebook()
    .then(res => {
      this.router.navigate(['/login']);
    })
  }

}
