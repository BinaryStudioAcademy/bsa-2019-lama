import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/models/User/user';
import { AlbumService } from 'src/app/services/album.service';
import { takeUntil } from 'rxjs/operators';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { AlbumExistPhotos } from 'src/app/models/Album/AlbumExistPhotos';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-select-album-modal',
  templateUrl: './select-album-modal.component.html',
  styleUrls: ['./select-album-modal.component.sass']
})
export class SelectAlbumModalComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  selectedAlbum: ViewAlbum;
  AlbumExistPhotos: AlbumExistPhotos;
  PhotosId = new Array<number>();
  isActive = true;

  @Input()
  isShown: boolean;
  albums: ViewAlbum[];
  @Input() photos: PhotoRaw[];

  @Output()
  currentUser: User;

  @Output() Close = new EventEmitter();

  imgname = require('../../../../assets/icon-no-image.svg');

  constructor(
    private albumService: AlbumService,
    private notifier: NotifierService,
    private fileService: FileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.GetCurrentUser();
    this.GetAlbums();
  }

  GetAlbums() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.albumService
      .getAlbums(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        albums => {
          this.albums = albums.body;
          this.albums.forEach(a => {
            if (
              a.photo == null &&
              a.photoAlbums != null &&
              a.photoAlbums.length > 0
            ) {
              a.photo = a.photoAlbums[0];
            }
          });
        },
        error => this.notifier.notify('error', 'Error loading albums')
      );
  }

  GetCurrentUser() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.userService
      .getUser(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        user => (this.currentUser = user),
        error => this.notifier.notify('error', 'Error getting user')
      );
  }

  toggleModal() {
    this.Close.emit(null);
  }

  clickPerformed(album: ViewAlbum) {
    if (this.selectedAlbum !== album) {
      this.selectedAlbum = album;
    } else {
      this.selectedAlbum = null;
    }
  }

  saveChanges() {
    this.photos.forEach(p => this.PhotosId.push(p.id));
    this.AlbumExistPhotos = {
      AlbumId: this.selectedAlbum.id,
      photosId: this.PhotosId
    };
    this.albumService
      .addExistPhotosToAlbum(this.AlbumExistPhotos)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        photos => {
          if (photos.length !== 0) {
            this.notifier.notify('success', 'Photos added');
          } else {
            this.notifier.notify('error', 'Photos already exist in album');
          }
          this.toggleModal();
        },
        error => this.notifier.notify('error', 'Error adding photos')
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
