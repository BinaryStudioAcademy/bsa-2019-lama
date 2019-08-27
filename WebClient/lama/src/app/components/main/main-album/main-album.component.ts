import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw, User, PhotoToDeleteRestoreDTO } from 'src/app/models';
import { AlbumService } from 'src/app/services/album.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { FileService } from 'src/app/services/file.service';
import { NotifierService } from 'angular-notifier';
import { AddPhotosToAlbumModalComponent } from '../../view-album-module/add-photos-to-album-modal/add-photos-to-album-modal.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-album',
  templateUrl: './main-album.component.html',
  styleUrls: ['./main-album.component.sass']
})
export class MainAlbumComponent implements OnInit {
  @Output()
  public deleteAlbumEvent: EventEmitter<ViewAlbum> = new EventEmitter<
    ViewAlbum
  >();

  @Input('_album') album: ViewAlbum;
  @Input('_isFavorite') isFavorite: boolean;
  @Output() Click = new EventEmitter<ViewAlbum>();
  @Output() ClickDownload = new EventEmitter<ViewAlbum>();
  @Input() currentUser: User;
  @ViewChild('AddPhotosToAlbum', { static: true, read: ViewContainerRef })
  private modaladdPhoto: ViewContainerRef;

  isContent = false;
  isMenu = true;
  showSharedModal = false;
  showSetCoverModal = false;
  imageUrl: string;

  imgname = require('../../../../assets/icon-no-image.svg');
  constructor(
    private albumService: AlbumService,
    private favoriteService: FavoriteService,
    private fileService: FileService,
    private notifier: NotifierService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    if (this.album.photo !== null) {
      this.fileService
        .getPhoto(this.album.photo.blob256Id)
        .subscribe(url => (this.imageUrl = url));
    }
  }

  clickPerformed(): void {
    this.Click.emit(this.album);
  }

  receiveUpdatedCover(event: PhotoRaw) {
    this.album.photo = event;
    this.fileService.getPhoto(event.blob256Id).subscribe(url => {
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
    componentRef.instance.AddingPhotosToAlbum.subscribe(
      this.AddToAlbumNewPhotos.bind(this)
    );
  }

  AddToAlbumNewPhotos(photos: PhotoRaw[]) {
    if (this.album.photoAlbums === null) {
      this.album.photoAlbums = [];
    }
    this.album.photoAlbums.push(...photos);
    if (this.album.photo === null) {
      this.album.photo = photos[0];
      this.fileService
        .getPhoto(this.album.photo.blob256Id)
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
        .subscribe(
          x => this.notifier.notify('success', 'Album Deleted'),
          error => this.notifier.notify('error', 'Error deleting album')
        );
      localStorage.removeItem('favoriteCover');
    } else {
      this.albumService
        .removeAlbum(this.album.id)
        .subscribe(
          x => this.notifier.notify('success', 'Album Deleted'),
          error => this.notifier.notify('error', 'Error deleting album')
        );
    }
    this.deleteAlbumEvent.emit(this.album);
  }

  private removeDuplicates() {
    const deletingArray = [];
    this.fileService.getDuplicates(this.currentUser.id).subscribe(duplicates => {
      this.album.photoAlbums.forEach(photo => {
        if (duplicates.map(x => x.name).includes(photo.name)) {
          deletingArray.push(photo.id);
        }
      });
      deletingArray.forEach(id => {
        this.fileService.markPhotoAsDeleted(id).subscribe(x => x);
        this.notifier.notify('success', 'Duplicates removed to the bin');
      });
      if (this.album.photoAlbums.length === 0) {
        this.albumService.removeAlbum(this.album.id).subscribe(x => x);
      }

      // this.fileService.deletePhotosPermanently(deletingArray).subscribe(x => {
      //   this.notifier.notify('success', 'successssss');
      // });
    });
  }
}
