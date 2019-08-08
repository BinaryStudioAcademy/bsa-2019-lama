import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.sass']
})
export class LandingLoginComponent implements OnInit {

  showAuthModal: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  public openAuthWindow(){
    if (this.authService.isUserExisted) {
      this.router.navigate(['/login']);
    }
    this.showAuthModal = true;
    
  }

}
