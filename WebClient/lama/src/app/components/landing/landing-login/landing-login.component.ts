import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from 'src/app/services';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifierService } from 'angular-notifier';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.sass']
})
export class LandingLoginComponent implements OnInit {
  showAuthModal = false;
  private user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    public afAuth: AngularFireAuth,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe(
      user => (this.user = user),
      error => this.notifier.notify('error', 'Error loading')
    );
  }

  public openAuthWindow() {
    if (this.user) {
      this.authService.saveCreadeatins(this.user);
      this.router.navigate(['/main']);
    }
    this.showAuthModal = true;
  }
}
