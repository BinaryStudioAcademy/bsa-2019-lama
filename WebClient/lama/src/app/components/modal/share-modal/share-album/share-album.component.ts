import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';

@Component({
  selector: 'app-share-album',
  templateUrl: './share-album.component.html',
  styleUrls: ['./share-album.component.sass']
})
export class ShareAlbumComponent implements OnInit {

  @Input()
  receivedAlbum: ViewAlbum;
  public album: ViewAlbum;
  public showSharedByLinkModal = false;
  public showSharedByEmailModal = false;

  @Output() Close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openShareByLink() {
    console.log(this.receivedAlbum);
    this.showSharedByLinkModal = true;
  }

  openShareByEmail() {
    this.showSharedByEmailModal = true;
  }

  public cancel() {
    this.Close.emit(null);
  }
}
