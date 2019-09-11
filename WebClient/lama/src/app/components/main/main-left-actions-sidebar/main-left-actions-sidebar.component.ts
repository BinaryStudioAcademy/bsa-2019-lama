import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() photos = new EventEmitter();

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
        title: 'Categories',
        icon: 'dashboard',
        route: 'categories'
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
  EnterPhotos(e) {
    if (e === 'photos' && this.router.url.search('photos') !== -1) {
      this.photos.emit();
    }
  }
}
