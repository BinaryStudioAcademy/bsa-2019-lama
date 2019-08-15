import { Component, OnInit, Input } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';

@Component({
  selector: 'app-set-album-cover-modal',
  templateUrl: './set-album-cover-modal.component.html',
  styleUrls: ['./set-album-cover-modal.component.sass']
})
export class SetAlbumCoverModalComponent implements OnInit {

  @Input() receivedAlbum: ViewAlbum;

  constructor() { }

  ngOnInit() {
    this.receivedAlbum.photoAlbums.forEach(x => console.log(x.blobId));
  }
}
