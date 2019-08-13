import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Album } from 'src/app/models/Album/album';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';


@Component({
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {

  @Input ('_album') album: ViewAlbum;
  @Output() onClick = new EventEmitter<ViewAlbum>();

  isContent:boolean = false;
  isMenu:boolean = true;
  showSharedModal: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public clickPerformed(): void {
    this.onClick.emit(this.album);
  }

  public clickMenu() {
     this.isContent = true;
     this.isMenu = false;
  }
  public leave($event)
  {
    this.isContent = false;
    this.isMenu = true;
  }

  public openShareModal(): void
  {
    this.showSharedModal = true;
  }
}
