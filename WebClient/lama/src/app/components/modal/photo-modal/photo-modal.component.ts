import { Component, OnInit, Input } from '@angular/core';


import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

import { ActionItem, UpdatePhotoDTO, ImageCroppedArgs } from 'src/app/models';

import { FileService } from 'src/app/services';

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
  public showSharedModal: boolean = false;

  public clickedMenuItem: ActionItem;
  public shownMenuItems: ActionItem[];

  // fields
  private fileService: FileService;

  private defaultMenuItem: ActionItem[];
  private editingMenuItem: ActionItem[];

  // constructors
  constructor(fileService: FileService)
  {
    this.isShown = true;

    this.fileService = fileService;

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

  public cropImageHandler(croppedImage: ImageCroppedArgs): void
  {
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: croppedImage.originalImageUrl,
      imageBase64: croppedImage.croppedImageBase64
    };

    this.fileService.update(updatePhotoDTO)
      .subscribe(updatedPhotoDTO =>
        {
          Object.assign(this.photo, updatedPhotoDTO);

          this.goBackToImageView();
        });
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
