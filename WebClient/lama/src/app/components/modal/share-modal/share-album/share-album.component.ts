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
  public showSharedByLinkModal: boolean = false;
  public showSharedByEmailModal: boolean = false;

  @Output() onClose = new EventEmitter();

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

  public cancel(){
    this.onClose.emit(null);
  }
}
