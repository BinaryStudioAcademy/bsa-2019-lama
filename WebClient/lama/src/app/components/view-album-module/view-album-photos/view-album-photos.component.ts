import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/Photo/photo';
import { PhotoRaw } from 'src/app/models';

@Component({
  selector: 'app-view-album-photos',
  templateUrl: './view-album-photos.component.html',
  styleUrls: ['./view-album-photos.component.sass']
})
export class ViewAlbumPhotosComponent implements OnInit {

  @Input ('_photo') photo: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>();

  constructor() { }

  ngOnInit() {
  }

  public clickPerformed(): void {
    this.Click.emit(this.photo);
  }

}
