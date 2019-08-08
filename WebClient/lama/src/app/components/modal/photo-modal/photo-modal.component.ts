import { Component, OnInit, Input } from '@angular/core';



import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Photo, ActionItem } from 'src/app/models';



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
  public hostName: string;
  public showSharedModal: boolean = false;

  public clickedMenuItem: ActionItem;
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
    this.clickedMenuItem = null;
  }

  ngOnInit()
  {
  }

  private initializeMenuItem()
  {
    this.defaultMenuItem =
    [
      { title: "share",    icon: "share" , route: ''},
      { title: "remove",   icon: "clear", route: ''},
      { title: "download", icon: "cloud_download", route: '' },
      { title: "edit",     icon: "edit", route: '' }
    ];
    this.editingMenuItem =
    [
      { title: "crop",   icon: "crop", route: '' },
      { title: "rotate", icon: "rotate_left", route: '' }
    ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: ActionItem): void
  {
    this.clickedMenuItem = clickedMenuItem;

    if (clickedMenuItem === this.defaultMenuItem[3])
    {
      this.shownMenuItems = this.editingMenuItem;
    }

    if(clickedMenuItem == this.defaultMenuItem[0]){
      this.openShareModal();
    }
  }

  public mouseLeftOverlayHandler(): void
  {
    this.shownMenuItems = this.defaultMenuItem;
  }

  public cropImageHandler(croppedImage: ImageCroppedEvent): void
  {
    // TODO: save in elastic
    this.photo.blobId = croppedImage.base64;

    this.goBackToImageView();
  }

  public goBackToImageView(): void
  {
    this.clickedMenuItem = null;
  }
  protected closeModal(): void
  {
    this.isShown = false;
  }

  private openShareModal(){
    this.showSharedModal = true;
  }
}
