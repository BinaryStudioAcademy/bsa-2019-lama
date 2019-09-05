import { Component, OnInit, Input } from '@angular/core';
import { ActionItem } from 'src/app/models/View/action-item';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-left-actions-sidebar',
  templateUrl: './main-left-actions-sidebar.component.html',
  styleUrls: ['./main-left-actions-sidebar.component.sass']
})
export class MainLeftActionsSidebarComponent implements OnInit {
  constructor(private router: Router) {}

  items: ActionItem[];
  ngOnInit() {
    this.items = [
      {
        title: 'Photos',
        icon: 'insert_photo',
        route: 'photos'
      },
      {
        title: 'Albums',
        icon: 'photo_album',
        route: 'albums'
      },
      {
        title: 'Sharing',
        icon: 'people',
        route: 'sharing'
      },
      {
        title: 'Places',
        icon: 'place',
        route: 'location'
      },
      {
        title: 'Removed photos',
        icon: 'delete',
        route: 'bin'
      }
    ];
  }

  isCurrentRouteRight(route: string) {
    return route && this.router.url.search(route) !== -1;
  }
}
