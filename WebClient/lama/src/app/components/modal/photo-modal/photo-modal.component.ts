import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

import { UpdatePhotoDTO, ImageEditedArgs, MenuItem } from 'src/app/models';

import { FileService } from 'src/app/services';
import { User } from 'src/app/models/User/user';
import { NewLike } from 'src/app/models/Reaction/NewLike';
import {Like } from 'src/app/models/Reaction/Like';
import { parse } from 'querystring';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit {
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
  @Output()
  public updatePhotoEvent = new EventEmitter<PhotoRaw>();

  // fields
  private fileService: FileService;

  private defaultMenuItem: MenuItem[];
  private editingMenuItem: MenuItem[];
  private deletingMenuItem: MenuItem[];

  currentUser: User;
  private hasUserReaction: boolean;
  // constructors
  constructor(fileService: FileService) {
    this.isShown = true;

    this.fileService = fileService;

    this.initializeMenuItem();

    this.shownMenuItems = this.defaultMenuItem;
    this.clickedMenuItem = null;
  }

  ngOnInit() {
    if (this.photo.reactions != null) {
      this.hasUserReaction = this.photo.reactions.some(x => x.userId === parseInt(this.currentUser.id));
      if (this.hasUserReaction) {
        this.hasUserReaction = true;
      } else {
        this.hasUserReaction = false;
      }
    }
    else {
      this.hasUserReaction = false;
    }
  }

  private initializeMenuItem() {
    this.defaultMenuItem =
      [
        { title: "share", icon: "share" },
        { title: "remove", icon: "clear" },
        { title: "download", icon: "cloud_download" },
        { title: "edit", icon: "edit" }
      ];
    this.editingMenuItem =
      [
        { title: "crop", icon: "crop" },
        { title: "rotate", icon: "rotate_left" }
      ];
    this.deletingMenuItem =
      [
        { title: "yes", icon: "done" },
        { title: "no", icon: "remove" }
      ];
  }

  // methods
  public menuClickHandler(clickedMenuItem: MenuItem): void {
    this.clickedMenuItem = clickedMenuItem;


    // share
    if (clickedMenuItem === this.defaultMenuItem[0]) {
      this.openShareModal();
    }

    // remove
    if (clickedMenuItem === this.defaultMenuItem[1]) {
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
    if (clickedMenuItem === this.defaultMenuItem[3]) {
      this.shownMenuItems = this.editingMenuItem;
    }


  }

  public mouseLeftOverlayHandler(): void {
    this.shownMenuItems = this.defaultMenuItem;
  }

  public imageHandler(editedImage: ImageEditedArgs): void {
    const updatePhotoDTO: UpdatePhotoDTO = {
      id: this.photo.id,
      blobId: editedImage.originalImageUrl,
      imageBase64: editedImage.croppedImageBase64
    };

    this.fileService.update(updatePhotoDTO)
      .subscribe(updatedPhotoDTO =>
        {
          Object.assign(this.photo, updatedPhotoDTO);
        //  this.updatePhotoEvent.emit(updatePhotoDTO);
          this.goBackToImageView();
        });
  }

  public goBackToImageView(): void {
    this.clickedMenuItem = null;
  }
  protected closeModal(): void {
    this.isShown = false;
  }

  private openShareModal(): void {
    this.showSharedModal = true;
  }
  private deleteImage(): void {
    this.fileService.markPhotoAsDeleted(this.photo.id)
      .subscribe(res => {
        this.closeModal();

        this.deletePhotoEvenet.emit(this.photo.id);
      });
  }
  public ReactionPhoto(event) {
   
    if (this.photo.userId === parseInt(this.currentUser.id)) {
  
    }
    let hasreaction = this.photo.reactions.some(x => x.userId === parseInt(this.currentUser.id));
    const newReaction: NewLike = {
      photoId: this.photo.id,
      userId: parseInt(this.currentUser.id)
    }
    if (hasreaction) {
      this.fileService.RemoveReactionPhoto(newReaction).subscribe(x => { this.photo.reactions = this.photo.reactions.filter(x=> x.userId != parseInt(this.currentUser.id)); this.hasUserReaction = false }  );
    }
    else {
      this.fileService.ReactionPhoto(newReaction).subscribe(x => { this.photo.reactions.push({ userId: parseInt(this.currentUser.id)}); this.hasUserReaction = true }  );
    }
  }

  forceDownload(event) {
    let element = event.target as Element;
    var url = element.getAttribute("data-href");
    var fileName = element.getAttribute("data-href");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      var urlCreator = window.URL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }
}
