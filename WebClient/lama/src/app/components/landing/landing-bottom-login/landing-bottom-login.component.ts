import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'landing-bottom-login',
  templateUrl: './landing-bottom-login.component.html',
  styleUrls: ['./landing-bottom-login.component.sass']
})
export class LandingBottomLoginComponent implements OnInit {

  showAuthModal = false;
  constructor() { }

  ngOnInit() {
  }

  public openAuthWindow() {
    this.showAuthModal = true;
  }
}
