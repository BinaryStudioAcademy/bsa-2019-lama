import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoRaw } from 'src/app/models';

@Component({
  selector: 'app-choose-album-cover',
  templateUrl: './choose-album-cover.component.html',
  styleUrls: ['./choose-album-cover.component.sass']
})
export class ChooseAlbumCoverComponent implements OnInit {

  @Input ('photo') photo: PhotoRaw;
  @Output() onClick = new EventEmitter<PhotoRaw>();

  //Choose:boolean;

  constructor() {
    //this.Choose = false;
   }

  ngOnInit() {
    console.log("app-choose-album-cover initialized")
  }

  public clickPerformed(event): void
  {
    //this.Choose = !this.Choose;
    this.onClick.emit(this.photo);
  }
}
