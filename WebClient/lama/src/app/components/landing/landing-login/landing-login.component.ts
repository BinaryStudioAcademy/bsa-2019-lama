import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'landing-login',
  templateUrl: './landing-login.component.html',
  styleUrls: ['./landing-login.component.sass']
})
export class LandingLoginComponent implements OnInit {

  showAuthModal: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  public openAuthWindow(){
    this.showAuthModal = true;
  }

}
