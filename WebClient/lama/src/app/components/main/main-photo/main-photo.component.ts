import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Photo } from 'src/app/models';

@Component({
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass']
})
export class MainPhotoComponent implements OnInit {

  // properties
  @Input ('_photo') photo: Photo;
  @Output() onClick = new EventEmitter<Photo>();

  // constructors
  constructor() { }

  ngOnInit() {
  }

  // methods
  public clickPerformed(): void
  {
    this.onClick.emit(this.photo);
  }
}
