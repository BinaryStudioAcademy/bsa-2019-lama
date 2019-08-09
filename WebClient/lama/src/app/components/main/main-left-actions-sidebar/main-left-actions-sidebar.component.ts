import { Component, OnInit } from '@angular/core';
import { ActionItem } from 'src/app/models/View/action-item';

@Component({
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
      route: '/main',
    },
    {
      title: 'Albums',
      icon: 'photo_album',
      route: '/main/albums'
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
    }];
  }

}
