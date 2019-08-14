import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass']
})
export class MainPhotoComponent implements OnInit {

  // properties
  @Input ('_photo') photo: PhotoRaw;
  isSelected: boolean = false;
  @Output() onClick = new EventEmitter<PhotoRaw>();

  // constructors
  constructor() { }

  ngOnInit() {

  }

  // methods
  public clickPerformed(): void
  {
    this.onClick.emit(this.photo);
  }

  public selectItem(): void 
  {
    let elements = document.getElementsByClassName('overlay');

    this.isSelected = !this.isSelected;
  }
}
