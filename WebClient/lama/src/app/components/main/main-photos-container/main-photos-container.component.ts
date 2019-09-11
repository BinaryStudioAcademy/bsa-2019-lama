import {
  Component,
  OnInit,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  DoCheck,
  OnDestroy,
  HostListener
} from '@angular/core';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { FileService } from 'src/app/services/file.service';
import { SharedService } from 'src/app/services/shared.service';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { User } from 'src/app/models/User/user';
import { FavoriteService } from 'src/app/services/favorite.service';
import { UserService } from 'src/app/services';
import { ZipService } from 'src/app/services/zip.service';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass'],
  providers: [FavoriteService, ZipService, UserService]
})
export class MainPhotosContainerComponent
  implements OnInit, DoCheck, OnDestroy {
  @Input() photos: PhotoRaw[] = [];
  showSpinner = true;
  isNothingFound: boolean;
  isSearchTriggered: boolean;
  currentUser: User;
  selectedPhotos: PhotoRaw[];
  duplicates: UploadPhotoResultDTO[] = [];
  isAtLeastOnePhotoSelected = false;
  favorites: Set<number> = new Set<number>();
  isHaveAnyPhotos = false;
  duplicatesFound = false;
  numberLoadPhoto = 30;
  currentPhotoIndex: number;
  unsubscribe = new Subject();
  shared: SharedService;
  showAddToAlbumModal = false;

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;
  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef })
  private modalUploadPhotoEntry: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private fileService: FileService,
    shared: SharedService,
    private favoriteService: FavoriteService,
    private zipService: ZipService,
    private userService: UserService,
    private notifier: NotifierService,
    private router: Router
  ) {
    this.favorites = new Set<number>();
    this.shared = shared;
  }

  async ngOnInit() {
    let userId: string = localStorage.getItem('userId');
    while (userId == null) {
      await this.delay(500);
      userId = localStorage.getItem('userId');
    }
    this.userService
      .getUser(parseInt(userId, 10))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        user => this.initializeUserAndFavorites(user),
        error => this.notifier.notify('error', 'Error getting user')
      );
    this.GetUserPhotosRange(
      parseInt(userId, 10),
      this.photos.length,
      this.numberLoadPhoto
    );
    this.selectedPhotos = [];
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  initializeUserAndFavorites(user: User) {
    this.currentUser = user;
    this.favoriteService
      .getFavoritesIds(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => (
          (this.favorites = new Set<number>(data)),
          error => this.notifier.notify('error', 'Error getting favourite')
        )
      );
  }

  public GetUserPhotos(userId: number) {
    this.isNothingFound = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.fileService
      .receiveUsersPhotos(userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        info => {
          this.photos = info as PhotoRaw[];
          this.showSpinner = false;
        },
        error => this.notifier.notify('error', 'Error getting photos')
      );
  }

  public GetUserPhotosRange(userId: number, startId: number, count: number) {
    if (
      this.shared.isSearchTriggered &&
      this.shared.isSearchTriggeredAtLeastOnce
    ) {
      this.photos = this.shared.foundPhotos;
      this.showSpinner = false;
      return;
    }
    if (startId === 0) {
      this.isNothingFound = false;
      this.shared.isSearchTriggeredAtLeastOnce = false;
      this.showSpinner = true;
      this.photos = [];
    }
    this.fileService
      // .receivePhoto()
      .receiveUsersPhotosRange(userId, startId, count)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        info => {
          this.photos.push(...info);
          this.showSpinner = false;
        },
        error => this.notifier.notify('error', 'Error getting photos')
      );
  }

  GetPhotos() {
    this.isNothingFound = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.fileService
      .receivePhoto()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        info => {
          this.photos = info as PhotoRaw[];
          this.showSpinner = false;
        },
        err => {
          this.notifier.notify('error', 'Error getting photos');
          this.showSpinner = false;
          this.isNothingFound = true;
        }
      );
  }

  ngDoCheck() {
    if (this.shared.restorePhotos) {
      this.shared.restorePhotos = false;
      const userId: string = localStorage.getItem('userId');
      this.GetUserPhotosRange(
        parseInt(userId, 10),
        this.photos.length,
        this.numberLoadPhoto
      );
    }
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.unshift(element);
      });
    }
    if (this.shared.deletedPhotos) {
      this.shared.deletedPhotos.forEach(item => {
        this.photos = this.photos.filter(i => i.id !== item);
      });
      this.shared.deletedPhotos = [];
    }
    if (this.shared.foundPhotos.length !== 0 && this.shared.isSearchTriggered) {
      this.photos = this.shared.foundPhotos;
      this.isNothingFound = false;
    }
    if (this.shared.foundPhotos.length === 0 && this.shared.isSearchTriggered) {
      this.photos = [];
      this.isNothingFound = true;
    }
    this.isSearchTriggered = this.shared.isSearchTriggeredAtLeastOnce;
    if (this.isSearchTriggered) {
      this.selectedPhotos = [];
    }
    this.shared.isSearchTriggered = false;
    this.shared.foundPhotos = [];
    this.shared.photos = [];
    if (this.selectedPhotos && this.selectedPhotos.length > 0) {
      this.isAtLeastOnePhotoSelected = true;
    } else {
      this.isAtLeastOnePhotoSelected = false;
    }
    if (this.photos.length !== 0 && !this.showSpinner) {
      this.isHaveAnyPhotos = true;
    } else {
      this.isHaveAnyPhotos = false;
    }
  }

  uploadFile(event) {
    this.modalUploadPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(
      PhotoUploadModalComponent
    );
    const componentRef = this.modalUploadPhotoEntry.createComponent(factory);
    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToListEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.uploadPhotoHandler.bind(this));
    componentRef.instance.toggleModal();
  }
  uploadPhotoHandler(uploadedPhotos: UploadPhotoResultDTO[]): void {
    this.photos.push(...uploadedPhotos);
  }

  photoSelected(eventArgs: PhotoRawState) {
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  photoClicked(eventArgs: PhotoRaw) {
    this.currentPhotoIndex = this.photos.indexOf(eventArgs);
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.currentIndex = this.currentPhotoIndex;
    componentRef.instance.photosArrayLength = this.photos.length;
    componentRef.instance.deletePhotoEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.deletePhotoHandler.bind(this));
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.updatePhotoHandler.bind(this));
    componentRef.instance.changePhotoEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.changePhotoHandler.bind(this));
  }

  deletePhotoHandler(photoToDeleteId: number) {
    this.photos = this.photos.filter(p => p.id !== photoToDeleteId);
  }

  changePhotoHandler(isNext: boolean) {
    if (isNext) {
      this.currentPhotoIndex++;
    } else {
      this.currentPhotoIndex--;
    }
    this.photoClicked(this.photos[this.currentPhotoIndex]);
    if (this.currentPhotoIndex === this.photos.length - 2) {
      this.GetUserPhotosRange(
        this.currentUser.id,
        this.photos.length,
        this.numberLoadPhoto
      );
    }
  }

  deleteDuplicatesHandler(event: number[]) {
    this.photos = this.photos.filter(photo => !event.includes(photo.id));
  }

  modalHandler(duplicatesRemoved: boolean) {
    this.duplicatesFound = duplicatesRemoved;
  }

  updatePhotoHandler(updatedPhoto: PhotoRaw): void {
    const index = this.photos.findIndex(i => i.id === updatedPhoto.id);
    this.photos[index] = Object.assign({}, updatedPhoto);
  }

  deleteImages(): void {
    if (this.isAtLeastOnePhotoSelected) {
      this.selectedPhotos.forEach(element => {
        this.fileService
          .markPhotoAsDeleted(element.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            res => {
              this.deletePhotoHandler(element.id);
            },
            error => this.notifier.notify('error', 'Error deleting images')
          );
      });
      this.selectedPhotos = [];
    } else {
      this.photos.forEach(element => {
        this.fileService
          .markPhotoAsDeleted(element.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            res => {
              this.deletePhotoHandler(element.id);
            },
            error => this.notifier.notify('error', 'Error deleting images')
          );
      });
    }
  }

  downloadImages() {
    if (this.isAtLeastOnePhotoSelected) {
      this.zipService.downloadImages(this.selectedPhotos);
    } else {
      this.zipService.downloadImages(this.photos);
    }
  }

  findDuplicates() {
    this.fileService
      .getDuplicates(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(duplicates => {
        this.duplicates = duplicates;
        if (this.duplicates.length > 0) {
          this.duplicatesFound = true;
        } else {
          this.notifier.notify('success', 'No duplicates found');
        }
      });
  }

  onScroll() {
    this.showSpinner = true;

    this.GetUserPhotosRange(
      this.currentUser.id,
      this.photos.length,
      this.numberLoadPhoto
    );
  }

  handleDropdownDisplay(dropDown: HTMLElement) {
    dropDown.style.display = dropDown.style.display
      ? dropDown.style.display === 'none'
        ? 'block'
        : 'none'
      : 'block';
  }

  handleDropdownOutsideClick(dropDown: HTMLElement) {
    dropDown.style.display = 'none';
  }

  addToAlbum() {
    this.showAddToAlbumModal = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
