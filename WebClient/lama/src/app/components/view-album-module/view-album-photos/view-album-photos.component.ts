import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/Photo/photo';

@Component({
  selector: 'app-view-album-photos',
  templateUrl: './view-album-photos.component.html',
  styleUrls: ['./view-album-photos.component.sass']
})
export class ViewAlbumPhotosComponent implements OnInit {

  @Input ('_photo') photo: Photo;
  @Output() onClick = new EventEmitter<Photo>();

  constructor() { }

  ngOnInit() {
  }

  public clickPerformed(): void
  {
    this.onClick.emit(this.photo);
  }

}
