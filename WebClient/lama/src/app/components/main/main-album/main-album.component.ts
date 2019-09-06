import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy
} from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw, User, PhotoToDeleteRestoreDTO } from 'src/app/models';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { FileService } from 'src/app/services/file.service';
import { NotifierService } from 'angular-notifier';
import { AddPhotosToAlbumModalComponent } from '../../view-album-module/add-photos-to-album-modal/add-photos-to-album-modal.component';
import { SharingService } from 'src/app/services/sharing.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit, OnDestroy {
  @Output()
  public deleteAlbumEvent: EventEmitter<ViewAlbum> = new EventEmitter<
    ViewAlbum
  >();

  @Input('_album') album: ViewAlbum;
  @Input('_isFavorite') isFavorite: boolean;
  @Output() Click = new EventEmitter<ViewAlbum>();
  @Output() ClickDownload = new EventEmitter<ViewAlbum>();
  @Input() currentUser: User;
  @Input() isShared = false;
  @Input() isCategoryAlbum = false;
  @ViewChild('AddPhotosToAlbum', { static: true, read: ViewContainerRef })
  private modaladdPhoto: ViewContainerRef;

  isContent = false;
  isMenu = true;
  showSharedModal = false;
  showSetCoverModal = false;
  imageUrl: string;
  isFake = false;
  isOwners = true;
  unsubscribe = new Subject();
  sharedAlbumCover = new Array<string>();

  imgname = require('../../../../assets/icon-no-image.svg');
  constructor(
    private albumService: AlbumService,
    private favoriteService: FavoriteService,
    private fileService: FileService,
    private notifier: NotifierService,
    private resolver: ComponentFactoryResolver,
    private sharingService: SharingService
  ) {}

  ngOnInit() {
    if (this.album.photo) {
      this.fileService
        .getPhoto(this.album.photo.blob256Id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(url => (this.imageUrl = url));
    }
    if (this.isShared && this.album.photoAlbums &&
        this.album.photoAlbums.length > 0) {
      this.album.photoAlbums.slice(0, 3).map(i => {
        this.fileService
          .getPhoto(i.blob256Id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(url => this.sharedAlbumCover.push(url));
      });
    }
    if (this.album.id === -1) {
      this.isFake = true;
    }
    if (
      this.album.photo !== null &&
      this.album.photo.userId !== this.currentUser.id
    ) {
      this.isOwners = false;
    }
  }

  clickPerformed(): void {
    this.Click.emit(this.album);
  }

  removeSharedAlbum() {
    this.sharingService
      .deleteSharedAlbum(this.album.id)
      .subscribe(() => this.deleteAlbumEvent.emit(this.album));
  }

  removeSharedAlbumForUser() {
    this.sharingService
      .deleteSharedAlbumForUser(this.album.id, this.currentUser.id)
      .subscribe(() => this.deleteAlbumEvent.emit(this.album));
  }

  removeFakeSharedAlbum() {
    this.sharingService
      .deleteSharedPhoto(this.album.photo.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.deleteAlbumEvent.emit(this.album));
  }

  receiveUpdatedCover(event: PhotoRaw) {
    this.album.photo = event;
    this.fileService
      .getPhoto(event.blob256Id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(url => {
        this.imageUrl = url;
        this.toggleSetCoverModal();
        this.notifier.notify('success', 'Cover Updated');
      });
  }

  clickMenu() {
    this.isContent = true;
    this.isMenu = false;
  }

  leave($event) {
    this.isContent = false;
    this.isMenu = true;
  }

  openShareModal() {
    this.showSharedModal = true;
  }

  toggleSetCoverModal() {
    this.showSetCoverModal = !this.showSetCoverModal;
  }

  addPhotos(e) {
    this.modaladdPhoto.clear();
    const factory = this.resolver.resolveComponentFactory(
      AddPhotosToAlbumModalComponent
    );
    const componentRef = this.modaladdPhoto.createComponent(factory);
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.AlbumId = this.album.id;
    componentRef.instance.photoAlbums = this.album.photoAlbums;
    componentRef.instance.AddingPhotosToAlbum.subscribe(
      this.AddToAlbumNewPhotos.bind(this)
    );
  }

  AddToAlbumNewPhotos(photos: PhotoRaw[]) {
    if (!this.album.photoAlbums) {
      this.album.photoAlbums = [];
    }
    this.album.photoAlbums.push(...photos);
    if (this.album.photo === null) {
      this.album.photo = photos[0];
      this.fileService
        .getPhoto(this.album.photo.blob256Id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(url => (this.imageUrl = url));
    }
  }

  DownloadAlbum(event) {
    this.ClickDownload.emit(this.album);
  }

  removeAlbum() {
    if (this.isFavorite) {
      const userId = localStorage.getItem('userId');
      this.favoriteService
        .deleteAllFavorites(parseInt(userId, 10))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => this.notifier.notify('success', 'Album Deleted'),
          error => this.notifier.notify('error', 'Error deleting album')
        );
      localStorage.removeItem('favoriteCover');
    } else {
      this.albumService
        .removeAlbum(this.album.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => {
            this.notifier.notify('success', 'Album Deleted');
            this.deleteAlbumEvent.emit(this.album);
          },
          error => this.notifier.notify('error', 'Error deleting album')
        );
    }
  }

  private removeDuplicates() {
    const deletingArray = [];
    this.fileService
      .getDuplicates(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(duplicates => {
        this.album.photoAlbums.forEach(photo => {
          if (duplicates.map(x => x.name).includes(photo.name)) {
            deletingArray.push(photo.id);
          }
        });
        deletingArray.forEach(id => {
          this.fileService
            .markPhotoAsDeleted(id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => x);
          this.notifier.notify('success', 'Duplicates removed to the bin');
        });
        if (this.album.photoAlbums.length === 0) {
          this.albumService
            .removeAlbum(this.album.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => x);
        }
      });
    if (this.album.photoAlbums.length === 0) {
      this.albumService.removeAlbum(this.album.id).subscribe(x => x);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
