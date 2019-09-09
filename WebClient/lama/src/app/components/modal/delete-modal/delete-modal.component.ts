import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteService } from 'src/app/services/favorite.service';
import { AlbumService } from 'src/app/services/album.service';
import { FileService } from 'src/app/services';
import { TouchSequence } from 'selenium-webdriver';
import { PhotoRaw } from 'src/app/models';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.sass']
})
export class DeleteModalComponent implements OnInit, OnDestroy {
  @Input() photos: PhotoRaw[];
  @Output() cancelClickedEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter<number[]>();
  userId: number;
  albumId = -1;
  unsubscribe = new Subject();
  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private albumService: AlbumService,
    private fileService: FileService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem('userId'), 10);
    if (this.permitDeleteFromAlbum()) {
      this.albumId = parseInt(
        this.router.url.slice(this.router.url.lastIndexOf('/') + 1),
        10
      );
    }
  }

  toBin() {
    const photos = this.photos.filter(p => p.userId === this.userId);
    if (photos.length === 0) {
      return;
    }
    for (const p of photos) {
      this.fileService.markPhotoAsDeleted(p.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(fs => fs);
    }
    if (photos.length === 1) {
      this.notifier.notify('success', 'Photo removed to bin');
    } else {
      this.notifier.notify('success', 'Photos removed to bin');
    }
    if (this.isFavorite()) {
      const ph2 = this.photos.filter(p => p.userId !== this.userId);
      const ids = new Array<number>();
      for (const p of ph2) {
        ids.push(p.id);
      }
      this.favoriteService
        .removeSelectedFavorites(this.userId, ids)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
    }
    this.emitToUp(this.photos.map(i => i.id));
    this.cancel();
  }

  fromAlbum() {
    const photos = this.photos.map(i => i.id);
    if (this.isFavorite()) {
      this.favoriteService
        .removeSelectedFavorites(this.userId, photos)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          fs => {
            this.notifier.notify(
              'success',
              'Favorites photos deleted from favorite album'
            );
          },
          error =>
            this.notifier.notify(
              'error',
              'Error deleting favorites from favorite album'
            )
        );
    } else {
      this.albumService.removePhotosFromAlbum(this.albumId, photos)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
        as => {
          this.notifier.notify('success', 'Photos deleted from album');
        },
        error =>
          this.notifier.notify('error', 'Error deleting photos from album')
      );
    }
    this.emitToUp(photos);
    this.cancel();
  }

  emitToUp(photos: number[]) {
    this.deleteEvent.emit(photos);
  }

  permitDeleteFromAlbum() {
    return this.router.url.includes('album');
  }

  isFavorite() {
    return this.albumId === 0;
  }

  cancel() {
    this.cancelClickedEvent.emit(null);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
