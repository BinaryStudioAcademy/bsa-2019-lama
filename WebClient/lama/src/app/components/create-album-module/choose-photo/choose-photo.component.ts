import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Photo } from 'src/app/models';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-choose-photo',
  templateUrl: './choose-photo.component.html',
  styleUrls: ['./choose-photo.component.sass']
})
export class ChoosePhotoComponent implements OnInit, OnDestroy {

  @Input ('_photo') photo: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>();

  Choose: boolean;
  imageUrl: string;
  unsubscribe = new Subject();

  constructor(private fileService: FileService) {
    this.Choose = false;
   }

  ngOnInit() {
    this.fileService.getPhoto(this.photo.blob256Id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(url => this.imageUrl = url);
  }

  clickPerformed() {
    this.Choose = !this.Choose;
    this.Click.emit(this.photo);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
