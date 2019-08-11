import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from 'src/app/services';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.sass']
})
export class LandingLoginComponent implements OnInit {

  showAuthModal: boolean = false;
  private _user:any;

  constructor(private authService: AuthService, private router: Router, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user => this._user = user);
  }

  public openAuthWindow(){
    if (this._user) {
      this.authService.saveCreadeatins(this._user);
      this.router.navigate(['/main']);
    }
    this.showAuthModal = true;
    
  }

}
