import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { FileService } from 'src/app/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-location-album',
  templateUrl: './location-album.component.html',
  styleUrls: ['./location-album.component.sass']
})
export class LocationAlbumComponent implements OnInit, OnDestroy {
  @Input('_album') album: ViewAlbum;
  @Output() Click = new EventEmitter<ViewAlbum>();
  @Output() ClickDownload = new EventEmitter<ViewAlbum>();

  imgname = require('../../../../assets/icon-no-image.svg');
  unsubscribe = new Subject();
  isContent = false;
  imageUrl: string;
  isMenu = true;
  constructor(private fileService: FileService) {}

  ngOnInit() {
    if (this.album.photo) {
      this.fileService
        .getPhoto(this.album.photo.blob256Id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(url => (this.imageUrl = url));
    }
  }
  clickPerformed(): void {
    this.Click.emit(this.album);
  }
  clickMenu() {
    this.isContent = true;
    this.isMenu = false;
  }
  DownloadAlbum(event) {
    this.ClickDownload.emit(this.album);
  }
  leave($event) {
    this.isContent = false;
    this.isMenu = true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
