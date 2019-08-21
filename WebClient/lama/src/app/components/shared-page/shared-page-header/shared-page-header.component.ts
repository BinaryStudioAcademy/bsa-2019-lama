import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-shared-page-header',
  templateUrl: './shared-page-header.component.html',
  styleUrls: ['./shared-page-header.component.sass']
})
export class SharedPageHeaderComponent implements OnInit {
  @Input() userName: string;
  @Input() userPhoto: string;

  isAuthenticated: boolean;
  constructor(
    private authService: AuthService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.authService.afAuth.user.subscribe(
      x => {
        this.userName = x.displayName;
        this.userPhoto = x.photoURL;
        this.isAuthenticated = this.authService.token !== null;
      },
      error => this.notifier.notify('error', 'Error authorize')
    );
  }

  public logOut() {
    this.authService.doLogout();
  }
}
