import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { User } from 'src/app/models';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { FileService } from 'src/app/services/file.service';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-album-item',
  templateUrl: './album-item.component.html',
  styleUrls: ['./album-item.component.sass']
})
export class AlbumItemComponent implements OnInit, OnDestroy {
  @Input('_album') album: ViewAlbum;
  @Output() Click = new EventEmitter<ViewAlbum>();
  @Input() currentUser: User;
  @Input() isSelected = false;

  imageUrl: string;
  unsubscribe = new Subject();

  imgname = require('../../../../../assets/icon-no-image.svg');
  constructor(
    private albumService: AlbumService,
    private favoriteService: FavoriteService,
    private fileService: FileService,
    private notifier: NotifierService
  ) {}

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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
