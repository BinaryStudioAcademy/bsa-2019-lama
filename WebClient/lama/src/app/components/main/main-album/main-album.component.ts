import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Album } from 'src/app/models/Album/album';


@Component({
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {

  @Input ('_album') album: Album;
  @Output() onClick = new EventEmitter<Album>();

  constructor() { }

  ngOnInit() {
  }

  public clickPerformed(): void {
    this.onClick.emit(this.album);
  }
}
