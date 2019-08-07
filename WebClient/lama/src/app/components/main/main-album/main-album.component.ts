import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Albumn } from 'src/app/models/Album/album';


@Component({
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {

  @Input ('_album') album: Albumn;
  @Output() onClick = new EventEmitter<Albumn>();

  constructor() { }

  ngOnInit() {
  }

  public clickPerformed(): void {
    this.onClick.emit(this.album);
  }
}
