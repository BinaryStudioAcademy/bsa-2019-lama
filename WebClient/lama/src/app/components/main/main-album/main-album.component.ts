import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Album } from 'src/app/models/Album/album';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';

import { saveAs } from "file-saver";
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';
import { PhotoRaw } from 'src/app/models';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {

  @Output()
  public deleteAlbumEvent: EventEmitter<ViewAlbum> = new EventEmitter<ViewAlbum>();

  @Input ('_album') album: ViewAlbum;

  @Output() onClick = new EventEmitter<ViewAlbum>();
  @Output() ClickDownload = new EventEmitter<ViewAlbum>();

  isContent:boolean = false;
  isMenu:boolean = true;
  showSharedModal: boolean = false;
  showSetCoverModal: boolean = false;

  imgname = require("../../../../assets/icon-no-image.svg");
  constructor(private _http: HttpClient, private albumService: AlbumService) { }

  ngOnInit() {
  }

  clickPerformed(): void {
    this.onClick.emit(this.album);
  }

  receiveUpdatedCover(event: PhotoRaw) {
    this.album.photo = event;
    this.toggleSetCoverModal();
  }

  clickMenu() {
     this.isContent = true;
     this.isMenu = false;
  }
  leave($event) {
    this.isContent = false;
    this.isMenu = true;
  }

  openShareModal() {
    this.showSharedModal = true;
  }

  toggleSetCoverModal() {
    this.showSetCoverModal = !this.showSetCoverModal;
  }

  DownloadAlbum(event) {
    this.ClickDownload.emit(this.album);
  }

  removeAlbum() {
    this.albumService.removeAlbum(this.album.id).subscribe( x => x);
    this.deleteAlbumEvent.emit(this.album);
  }

}
