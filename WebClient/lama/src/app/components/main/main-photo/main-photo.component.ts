import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState} from 'src/app/models/Photo/photoRawState';

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
  @Output() onSelect = new EventEmitter<PhotoRawState>();

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
    this.isSelected = !this.isSelected;
    this.onSelect.emit({photo: this.photo, isSelected: this.isSelected});
  }
}
