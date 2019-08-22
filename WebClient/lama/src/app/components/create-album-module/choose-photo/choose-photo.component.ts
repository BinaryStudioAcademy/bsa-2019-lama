import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services';

@Component({
  selector: 'app-choose-photo',
  templateUrl: './choose-photo.component.html',
  styleUrls: ['./choose-photo.component.sass']
})
export class ChoosePhotoComponent implements OnInit {

  @Input ('_photo') photo: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>();

  Choose: boolean;
  imageUrl: string;

  constructor(private fileService: FileService) {
    this.Choose = false;
   }

  ngOnInit() {
    this.fileService.getPhoto(this.photo.blob256Id).subscribe(url => this.imageUrl = url);
  }

  clickPerformed() {
    this.Choose = !this.Choose;
    this.Click.emit(this.photo);
  }

}
