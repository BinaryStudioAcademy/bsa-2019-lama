import {
  Component,
  OnInit,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  DoCheck,
  OnDestroy
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
  isDeleting: boolean;
  unsubscribe = new Subject();

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;
  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef })
  private modalUploadPhotoEntry: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private fileService: FileService,
    private shared: SharedService,
    private favoriteService: FavoriteService,
    private zipService: ZipService,
    private userService: UserService,
    private notifier: NotifierService
  ) {
    this.favorites = new Set<number>();
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
    if (startId === 0) {
      this.isNothingFound = false;
      this.shared.isSearchTriggeredAtLeastOnce = false;
      this.showSpinner = true;
      this.photos = [];
    }
    this.fileService
      .receivePhoto()
      //.receiveUsersPhotosRange(userId, startId, count)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        info => {
          this.photos.push(...info);
          console.log(this.photos);
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
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.unshift(element);
      });
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
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.deletePhotoHandler.bind(this));
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(this.updatePhotoHandler.bind(this));
  }

  deletePhotoHandler(photoToDeleteId: number) {
    this.photos = this.photos.filter(p => p.id !== photoToDeleteId);
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

  private deleteImages(): void {
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
  }

  downloadImages() {
    this.zipService.downloadImages(this.selectedPhotos);
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

  deleteWindow() {
    this.isDeleting = true;
  }

  goBackToImageView(): void {
    this.isDeleting = false;
  }

  deletePhotosHandler(photosToDelete: number[]) {
    for (const p of photosToDelete) {
      this.deletePhotoHandler(p);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
