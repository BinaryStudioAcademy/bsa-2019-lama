import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, UserService } from 'src/app/services';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifierService } from 'angular-notifier';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.sass']
})
export class LandingLoginComponent implements OnInit, OnDestroy {
  showAuthModal = false;
  private user: any;
  unsubscribe = new Subject();
  constructor(
    private authService: AuthService,
    private router: Router,
    public afAuth: AngularFireAuth,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.afAuth.user
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
      user => (this.user = user),
      error => this.notifier.notify('error', 'Error loading')
    );
  }

  public openAuthWindow() {
    if (this.user) {
      this.authService.saveCredentials(this.user);
      this.router.navigate(['/main']);
    }
    this.showAuthModal = true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
