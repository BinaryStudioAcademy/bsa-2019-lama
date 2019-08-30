import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, OnDestroy } from '@angular/core';
import { PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-choose-album-cover',
  templateUrl: './choose-album-cover.component.html',
  styleUrls: ['./choose-album-cover.component.sass']
})
export class ChooseAlbumCoverComponent implements OnInit, OnDestroy {


  @Input() cover: PhotoRaw;
  @Output() Click = new EventEmitter<PhotoRaw>(true);

  isSelected: boolean;
  imageUrl: string;
  unsubscribe = new Subject();

  constructor(private fileService: FileService) {
    this.isSelected = false;
   }

  ngOnInit() {
    this.fileService.getPhoto(this.cover.blob256Id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(url => this.imageUrl = url);
  }

  clickPerformed() {
    this.isSelected = !this.isSelected;
    this.Click.emit(this.cover);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
