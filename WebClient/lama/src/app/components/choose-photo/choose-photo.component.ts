import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-choose-photo',
  templateUrl: './choose-photo.component.html',
  styleUrls: ['./choose-photo.component.sass']
})
export class ChoosePhotoComponent implements OnInit {

  @Input ('_photo') photo: Photo;
  @Output() onClick = new EventEmitter<Photo>();

  Choose:boolean;

  constructor() {
    this.Choose = false;
   }

  ngOnInit() {
  }

  public clickPerformed(event): void
  {
    if(this.Choose == false)
    this.Choose=true;
    else
    this.Choose=false;
    
    this.onClick.emit(this.photo);

  }
  
}
