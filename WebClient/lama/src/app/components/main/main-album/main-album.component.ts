import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw } from 'src/app/models';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { NotifierService } from 'angular-notifier';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {

  @Output()
  public deleteAlbumEvent: EventEmitter<ViewAlbum> = new EventEmitter<ViewAlbum>();

  @Input ('_album') album: ViewAlbum;
  @Input ('_isFavorite') isFavorite: boolean;
  @Output() Click = new EventEmitter<ViewAlbum>();
  @Output() ClickDownload = new EventEmitter<ViewAlbum>();

  isContent = false;
  isMenu = true;
  showSharedModal = false;
  showSetCoverModal = false;

  imgname = require('../../../../assets/icon-no-image.svg');
  constructor(private albumService: AlbumService,
              private favoriteService: FavoriteService,
              private notifier: NotifierService) { }

  ngOnInit() {
  }

  clickPerformed(): void {
    this.Click.emit(this.album);
  }

  receiveUpdatedCover(event: PhotoRaw) {
    this.album.photo = event;
    this.toggleSetCoverModal();
    this.notifier.notify( 'success', 'Cover Updated' );
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

  DownloadAlbum(event) {
    this.ClickDownload.emit(this.album);
  }

  removeAlbum() {
    if (this.isFavorite) {
      const userId = localStorage.getItem('userId');
      this.favoriteService.deleteAllFavorites(parseInt(userId, 10)).subscribe(x => x);
      localStorage.removeItem('favoriteCover');
    } else {
      this.albumService.removeAlbum(this.album.id).subscribe( x => x);
    }
    this.deleteAlbumEvent.emit(this.album);
  }
}
