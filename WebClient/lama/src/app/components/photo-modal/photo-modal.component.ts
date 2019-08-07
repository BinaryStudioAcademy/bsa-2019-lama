import { Component, OnInit, Input } from '@angular/core';

import { ActionItem } from 'src/app/models/View/action-item';
import {  Photo } from 'src/app/models/Photo/photo';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit 
{
  // properties
  @Input()
  public photo: PhotoRaw;
  public isShown: boolean;

  public shownMenuItems: ActionItem[];

  // fields
  private defaultMenuItem: ActionItem[];
  private editingMenuItem: ActionItem[];

  // constructors
  constructor() 
  {
    this.isShown = true;

    this.initializeMenuItem();

    this.shownMenuItems = this.defaultMenuItem;
  }

  ngOnInit() 
  {
  }

  private initializeMenuItem()
  {    
    this.defaultMenuItem = 
    [
      { title: "share",    icon: "share" },
      { title: "remove",   icon: "clear" },
      { title: "download", icon: "cloud_download" },
      { title: "edit",     icon: "edit" }
    ];
    this.editingMenuItem =
    [
      { title: "crop",   icon: "crop" },
      { title: "rotate", icon: "rotate_left" }
    ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: ActionItem): void
  {
    if (clickedMenuItem == this.defaultMenuItem[3])
    {
      this.shownMenuItems = this.editingMenuItem;
    }
  }
  public mouseLeftOverlayHandler(): void
  {
    this.shownMenuItems = this.defaultMenuItem;
  }

  protected closeModal(): void
  {
    this.isShown = false;
  }
}
