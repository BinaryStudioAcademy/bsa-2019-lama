import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})

export class MainPageComponent implements OnInit {

  constructor() { }

  showSidebarMenu: boolean;

  @HostListener('window:resize', ['$event']) onresize(event) {
    if (event.target.innerWidth < 768) {
      this.showSidebarMenu = false;
    }
  }


  ngOnInit() {

  }

  public receiveSidebarState($event) {
    this.showSidebarMenu = $event;
  }
}
