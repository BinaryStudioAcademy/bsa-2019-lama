import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    this.authService.loginWithGoogle()
    .then(() => this.afterSignIn());
  }

  public tryTwitterLogin(){
    this.authService.loginWithTwitter()
    .then(() => this.afterSignIn());
  }

  public tryFacebookLogin(){
    this.authService.loginWithFacebook()
    .then(() => this.afterSignIn());
  }

  private afterSignIn(){
    this.router.navigate(['/login']);
  }

}
