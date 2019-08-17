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

  @Output() Close = new EventEmitter();

  userProfileData: string;
  errorMessage = '';

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.Close.emit(null);
  }

  tryGoogleLogin() {
    this.authService.loginWithGoogle()
    .then(() => this.afterSignIn());
  }

  tryTwitterLogin() {
    this.authService.loginWithTwitter()
    .then(() => this.afterSignIn());
  }

  tryFacebookLogin() {
    this.authService.loginWithFacebook()
    .then(() => this.afterSignIn());
  }

  private afterSignIn() {
    this.router.navigate(['/main']);
  }

}
