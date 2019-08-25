import {
  Component,
  OnInit,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  DoCheck
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

@Component({
  selector: 'app-main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass'],
  providers: [FavoriteService, ZipService, UserService]
})
export class MainPhotosContainerComponent implements OnInit, DoCheck {
  @Input() photos: PhotoRaw[] = [];
  showSpinner = true;
  isNothingFounded: boolean;
  isSearchTriggered: boolean;
  currentUser: User;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  favorites: Set<number> = new Set<number>();
  isHaveAnyPhotos = false;
  numberLoadPhoto = 30;

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
      .subscribe(
        data => (
          (this.favorites = new Set<number>(data)),
          error => this.notifier.notify('error', 'Error getting favourite')
        )
      );
  }

  public GetUserPhotos(userId: number) {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.fileService.receiveUsersPhotos(userId).subscribe(
      info => {
        this.photos = info as PhotoRaw[];
        this.showSpinner = false;
      },
      error => this.notifier.notify('error', 'Error getting photos')
    );
  }

  public GetUserPhotosRange(userId: number, startId: number, count: number) {
    if (startId === 0) {
      this.isNothingFounded = false;
      this.shared.isSearchTriggeredAtLeastOnce = false;
      this.showSpinner = true;
      this.photos = [];
    }
    this.fileService.receiveUsersPhotosRange(userId, startId, count).subscribe(
      info => {
        this.photos.push(...info);
        this.showSpinner = false;
      },
      error => this.notifier.notify('error', 'Error getting photos')
    );
  }

  GetPhotos() {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false;
    this.showSpinner = true;
    this.photos = [];
    this.fileService.receivePhoto().subscribe(
      info => {
        this.photos = info as PhotoRaw[];
        this.showSpinner = false;
      },
      err => {
        this.notifier.notify('error', 'Error getting photos');
        this.showSpinner = false;
        this.isNothingFounded = true;
      }
    );
  }

  ngDoCheck() {
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.unshift(element);
      });
    }
    if (
      this.shared.foundedPhotos.length !== 0 &&
      this.shared.isSearchTriggered
    ) {
      this.photos = this.shared.foundedPhotos;
      this.isNothingFounded = false;
    }
    if (
      this.shared.foundedPhotos.length === 0 &&
      this.shared.isSearchTriggered
    ) {
      this.photos = [];
      this.isNothingFounded = true;
    }
    this.isSearchTriggered = this.shared.isSearchTriggeredAtLeastOnce;
    if (this.isSearchTriggered) {
      this.selectedPhotos = [];
    }
    this.shared.isSearchTriggered = false;
    this.shared.foundedPhotos = [];
    this.shared.photos = [];
    if (this.selectedPhotos && this.selectedPhotos.length > 0) {
      this.isAtLeastOnePhotoSelected = true;
    } else {
      this.isAtLeastOnePhotoSelected = false;
    }
    if (this.photos.length === 0 && !this.showSpinner) {
      this.isHaveAnyPhotos = false;
    } else {
      this.isHaveAnyPhotos = true;
    }
  }

  // methods
  public uploadFile(event) {
    this.modalUploadPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(
      PhotoUploadModalComponent
    );
    const componentRef = this.modalUploadPhotoEntry.createComponent(factory);
    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToListEvent.subscribe(
      this.uploadPhotoHandler.bind(this)
    );
    componentRef.instance.toggleModal();
  }
  public uploadPhotoHandler(uploadedPhotos: UploadPhotoResultDTO[]): void {
    this.photos.push(...uploadedPhotos);
  }

  public photoSelected(eventArgs: PhotoRawState) {
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  public photoClicked(eventArgs: PhotoRaw) {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvenet.subscribe(
      this.deletePhotoHandler.bind(this)
    );
    componentRef.instance.currentUser = this.currentUser;
    componentRef.instance.updatePhotoEvent.subscribe(
      this.updatePhotoHandler.bind(this)
    );
  }

  public deletePhotoHandler(photoToDeleteId: number): void {
    this.photos = this.photos.filter(p => p.id !== photoToDeleteId);
  }

  public updatePhotoHandler(updatedPhoto: PhotoRaw): void {
    const index = this.photos.findIndex(i => i.id === updatedPhoto.id);
    this.photos[index] = Object.assign({}, updatedPhoto);
  }

  private deleteImages(): void {
    this.selectedPhotos.forEach(element => {
      this.fileService.markPhotoAsDeleted(element.id).subscribe(
        res => {
          this.deletePhotoHandler(element.id);
        },
        error => this.notifier.notify('error', 'Error deleting images')
      );
    });
  }

  public downloadImages() {
    this.zipService.downloadImages(this.selectedPhotos);
  }

  onScroll() {
    this.showSpinner = true;

    this.GetUserPhotosRange(
      this.currentUser.id,
      this.photos.length,
      this.numberLoadPhoto
    );
  }
}
