import { Component, OnInit, Input } from '@angular/core';
import { Image } from 'src/app/models/image';

@Component({
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass']
})
export class MainPhotoComponent implements OnInit {

  constructor() { }
  @Input ('_photo') photo: Image;

  ngOnInit() {
  }

}
