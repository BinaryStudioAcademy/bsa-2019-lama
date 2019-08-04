import { Component, OnInit } from '@angular/core';
import { ActionItem } from 'src/app/models/actionsitem';

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
      title: "Photos",
      icon: "insert_photo"
    },
    {
      title: "Albums",
      icon: "photo_album"
    },
    {
      title: "Sharing",
      icon: "people"
    },
    {
      title: "Locations",
      icon: "gps_fixed"
    },
    {
      title: "Places",
      icon: "place"
    },
    {
      title: "People links",
      icon: "person"
    }]
  }

}
