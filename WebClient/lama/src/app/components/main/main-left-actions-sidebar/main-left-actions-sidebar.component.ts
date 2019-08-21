import { Component, OnInit, Input } from '@angular/core';
import { ActionItem } from 'src/app/models/View/action-item';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-left-actions-sidebar',
  templateUrl: './main-left-actions-sidebar.component.html',
  styleUrls: ['./main-left-actions-sidebar.component.sass']
})
export class MainLeftActionsSidebarComponent implements OnInit {

  constructor() { }
  items: ActionItem[];
  ngOnInit() {
    this.items = [{
      title: 'Photos',
      icon: 'insert_photo',
      route: 'photos',
    },
    {
      title: 'Albums',
      icon: 'photo_album',
      route: 'albums'
    },
    {
      title: 'Sharing',
      icon: 'people',
      route: ''
    },
    {
      title: 'Places',
      icon: 'place',
      route: ''
    },
    {
      title: 'People links',
      icon: 'person',
      route: ''
    },
    {
      title: 'Removed photos',
      icon: 'delete',
      route: 'bin'
    }];
  }

}
