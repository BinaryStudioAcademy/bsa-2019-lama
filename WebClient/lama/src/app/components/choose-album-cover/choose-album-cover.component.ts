import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { PhotoRaw } from 'src/app/models';

@Component({
  selector: 'app-choose-album-cover',
  templateUrl: './choose-album-cover.component.html',
  styleUrls: ['./choose-album-cover.component.sass']
})
export class ChooseAlbumCoverComponent implements OnInit {


  @Input() cover: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>(true);

  isSelected: boolean;

  constructor() {
    this.isSelected = false;
   }

  ngOnInit() {
  }

  clickPerformed() {
    this.isSelected = !this.isSelected;
    this.Click.emit(this.cover);
  }
}
