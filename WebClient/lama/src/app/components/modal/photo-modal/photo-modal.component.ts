import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

import { UpdatePhotoDTO, ImageCroppedArgs, MenuItem } from 'src/app/models';

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

  public clickedMenuItem: MenuItem;
  public shownMenuItems: MenuItem[];

  // events
  @Output() 
  public deletePhotoEvenet = new EventEmitter<number>();

  // fields
  private fileService: FileService;

  private defaultMenuItem: MenuItem[];
  private editingMenuItem: MenuItem[];
  private deletingMenuItem: MenuItem[];

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
      { title: "share",    icon: "share" },
      { title: "remove",   icon: "clear"},
      { title: "download", icon: "cloud_download" },
      { title: "edit",     icon: "edit" }
    ];
    this.editingMenuItem =
    [
      { title: "crop",   icon: "crop" },
      { title: "rotate", icon: "rotate_left" }
    ];
    this.deletingMenuItem = 
    [
      { title: "yes", icon: "done" },
      { title: "no", icon: "remove" }
    ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: MenuItem): void
  {
    this.clickedMenuItem = clickedMenuItem;


    // share
    if (clickedMenuItem === this.defaultMenuItem[0])
    {
      this.openShareModal();
    }
    
    // remove
    if (clickedMenuItem === this.defaultMenuItem[1])
    {
      this.shownMenuItems = this.deletingMenuItem;
    }
    
    if (clickedMenuItem === this.deletingMenuItem[0])// yes
    {
      this.deleteImage();
    }
    
    if (clickedMenuItem === this.deletingMenuItem[1])// no
    {
      this.shownMenuItems = this.defaultMenuItem;
    }

    // download

    // edit
    if (clickedMenuItem === this.defaultMenuItem[3])
    {
      this.shownMenuItems = this.editingMenuItem;
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

  private openShareModal(): void
  {
    this.showSharedModal = true;
  }
  private deleteImage(): void
  {
    this.fileService.markPhotoAsDeleted(this.photo.id)
    .subscribe(res =>
      {
        this.closeModal();

        this.deletePhotoEvenet.emit(this.photo.id);
      });
  }
}
