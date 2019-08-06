import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'landing-bottom-login',
  templateUrl: './landing-bottom-login.component.html',
  styleUrls: ['./landing-bottom-login.component.sass']
})
export class LandingBottomLoginComponent implements OnInit {

  showAuthModal: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  public openAuthWindow(){
    this.showAuthModal = true;
  }
}
