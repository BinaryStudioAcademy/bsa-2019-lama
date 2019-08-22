import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';

@Component({
  selector: 'app-choose-album-cover',
  templateUrl: './choose-album-cover.component.html',
  styleUrls: ['./choose-album-cover.component.sass']
})
export class ChooseAlbumCoverComponent implements OnInit {


  @Input() cover: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>(true);

  isSelected: boolean;
  imageUrl: string;

  constructor(private fileService: FileService) {
    this.isSelected = false;
   }

  ngOnInit() {
    this.fileService.getPhoto(this.cover.blob256Id).subscribe(url => this.imageUrl = url);
  }

  clickPerformed() {
    this.isSelected = !this.isSelected;
    this.Click.emit(this.cover);
  }
}
