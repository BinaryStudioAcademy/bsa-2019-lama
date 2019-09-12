import { AuthService } from 'src/app/services/auth.service';
import {
  Router,
  NavigationExtras,
  RouterEvent,
  NavigationEnd
} from '@angular/router';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  DoCheck,
  OnDestroy
} from '@angular/core';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http.service';
import { FileService } from 'src/app/services';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../environments/environment';
import { NotificationDTO } from 'src/app/models/Notification/notificationDTO';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { SearchSuggestionData } from 'src/app/models/searchSuggestionData';
import { NotificationService } from 'src/app/services/notification.service';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { DuplicatesModalComponent } from '../../modal/duplicates-modal/duplicates-modal.component';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { forkJoin } from 'rxjs';
import { Album } from 'src/app/models/Album/album';
import { SharingService } from 'src/app/services/sharing.service';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.sass']
})
export class MainPageHeaderComponent implements OnInit, DoCheck, OnDestroy {
  @Output() Click = new EventEmitter<boolean>();
  @ViewChild('photoUploadModal', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;
  @ViewChild('duplicatesModal', { static: true, read: ViewContainerRef })
  private duplicatesEntry: ViewContainerRef;
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;
  avatarUrl: string;
  isActive = false;
  newNotify = false;
  IsShowNotify = false;
  searchHistory: string[];
  searchSuggestions: SearchSuggestionData;
  searchSuggestionsEmpty = true;
  searchCriteria = '';
  id: number;
  toched = false;
  timeout = null;
  objectKeys = Object.keys;
  unicodeSearch = '\u2315';
  unicodeLocation = '\u2316';
  isSearchDropdownExpanded: boolean;
  public Hub: HubConnection;
  notification: NotificationDTO[];
  unsubscribe = new Subject();
  latestSearchAttempt = '';
  tagNames = [];
  words = [];
  showModal = false;
  duplicates: number[][] = [];
  shared: SharedService;
  photo;
  sharedItemId: number;

  constructor(
    public auth: AuthService,
    private router: Router,
    resolver: ComponentFactoryResolver,
    shared: SharedService,
    private http: HttpService,
    private file: FileService,
    private notifier: NotifierService,
    private notificationService: NotificationService,
    private sharingService: SharingService,
    private albumService: AlbumService
  ) {
    this.resolver = resolver;
    this.shared = shared;
  }

  async ngOnInit() {
    if (!this.auth.getLoggedUserId()) {
      return;
    }
    this.registerHub();
    this.id = parseInt(localStorage.getItem('userId'), 10);
    while (!this.id) {
      await this.delay(500);
      this.id = parseInt(localStorage.getItem('userId'), 10);
    }
    this.notificationService
      .getNotifications(this.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        u => {
          this.notification = u.reverse();
          this.checkNotification(this.notification);
          console.log(u);
          u.forEach(item => {
            if (item.activity === 2) {
              this.duplicates = JSON.parse(item.payload);
            } else if (item.activity === 3 || item.activity === 4) {
              this.sharedItemId = JSON.parse(item.payload);
            } else {
              this.photo = JSON.parse(item.payload);
            }
          });
        },
        error => this.notifier.notify('error', 'Error loading nofitications')
      );
    this.getSearchHistory(this.id);
    this.http
      .getData(`users/${this.id}`)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        u => {
          if (u.photoUrl) {
            if (u.photoUrl.indexOf('assets') === -1) {
              this.file
                .getPhoto(u.photoUrl)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(url => (this.avatarUrl = url));
            } else {
              this.avatarUrl = u.photoUrl;
            }
          }
        },
        error => this.notifier.notify('error', 'Error loading user')
      );
  }

  sendIsRead(id) {
    this.notificationService
      .sendIsRead(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        x => {
          this.checkNotification(this.notification);
        },
        error => this.notifier.notify('error', 'Error update notification')
      );
  }

  extractWords(searchSuggestions: SearchSuggestionData) {
    this.words = [];
    if (searchSuggestions.text.length > 0) {
      try {
        const obj = JSON.parse(searchSuggestions.text);
        const results = obj.regions.forEach(item => {
          item.lines.forEach(line => {
            line.words.forEach(word => {
              if (word.text.indexOf(`${this.searchCriteria}`) !== -1) {
                this.words.push(word.text.replace(/[.,?!]/g, ''));
              }
            });
          });
        });
        this.words = Array.from(new Set(this.words)).splice(0, 5);
      } catch (e) {}
    }
  }
  sendDelete(id) {
    this.notificationService
      .DeleteNotfication(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        x => {
          this.notification = this.notification.filter(z => z.id !== id);
          this.checkNotification(this.notification);
        },
        error => this.notifier.notify('error', 'Error deleting notification')
      );
  }

  deleteDuplicatesHandler(event: number[]) {
    this.shared.deletedPhotos = event;
    this.duplicates = [];
  }

  openPhoto(item: NotificationDTO) {
    const photoId = JSON.parse(item.payload);
    this.file
      .get(photoId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(photo => {
        this.modalPhotoEntry.clear();
        const factory = this.resolver.resolveComponentFactory(
          PhotoModalComponent
        );
        const componentRef = this.modalPhotoEntry.createComponent(factory);
        componentRef.instance.photo = photo;
      });
  }

  MarkAllAsRead() {
    this.notificationService
      .MarkAllAsRead(this.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        x => {
          this.notification.forEach(y => (y.isRead = true));
          this.checkNotification(this.notification);
        },
        error =>
          this.notifier.notify('error', 'Error mark as all read notification')
      );
  }

  registerHub() {
    const stringConnection = environment.lamaApiUrl + environment.hub;
    this.Hub = new HubConnectionBuilder()
      .withUrl(`${stringConnection}`, {
        accessTokenFactory: () => this.auth.token,
        transport: 4
      })
      .build();
    this.Hub.start().catch(error => console.log(error));

    this.Hub.on('Notification', (notification: NotificationDTO) => {
      if (notification) {
        this.addNotification(notification);
      }
      if (notification.activity === 2) {
        this.duplicates = JSON.parse(notification.payload);
      } else {
        this.photo = JSON.parse(notification.payload);
      }
    });
  }
  onChanged($event) {
    this.shared.isSearchTriggered = false;
    this.shared.restorePhotos = true;
    this.shared.isSearchTriggeredAtLeastOnce = false;
  }
  addNotification(notification) {
    this.notification.unshift(notification);
    this.checkNotification(this.notification);
  }
  DeleteNotification() {}
  checkNotification(notification: NotificationDTO[]) {
    const check = notification.some(x => x.isRead === false);
    if (check) {
      this.newNotify = true;
    } else {
      this.newNotify = false;
    }
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngDoCheck() {
    if (this.shared.avatar && this.shared.avatar.imageUrl) {
      if (this.shared.avatar.imageUrl === 'deleted') {
        this.avatarUrl = null;
      } else {
        if (this.shared.avatar.imageUrl.indexOf('base64') === -1) {
          this.file
            .getPhoto(this.shared.avatar.imageUrl)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(url => {
              this.avatarUrl = url;
            });
        } else {
          this.avatarUrl = this.shared.avatar.imageUrl;
        }
        this.shared.avatar = null;
      }
    }
    this.searchCriteria.length < 1 ||
    this.searchCriteria === this.latestSearchAttempt
      ? (this.isActive = false)
      : (this.isActive = true);
    if (this.isActive) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.getSearchSuggestions(this.id, this.searchCriteria);
      }, 300);
    }
  }
  find2(e) {
    if (e.length === 0) {
      this.searchSuggestionsEmpty = true;
    }
  }
  showSearchDropdown() {
    if (
      this.searchSuggestions !== undefined ||
      !this.searchSuggestionsEmpty ||
      this.searchHistory.length > 0
    ) {
      this.isSearchDropdownExpanded = true;
    }
  }

  hideSearchDropdown() {
    this.isSearchDropdownExpanded = false;
  }

  getSearchSuggestions(id: number, criteria: string) {
    this.toched = true;
    if (this.searchCriteria.length > 0) {
      criteria = criteria.trim();
      criteria = this.escapeHtml(criteria);
      if (criteria.length === 0) {
        return;
      }
      this.file
        .getSearchSuggestions(id, criteria)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(items => {
          this.latestSearchAttempt = criteria;
          this.searchSuggestions = items;
          this.extractWords(this.searchSuggestions);
          this.tagNames = this.extractTagNames(this.searchSuggestions)
            .filter((tagname: string) => tagname.includes(criteria))
            .filter(
              (element, index, array) => index === array.indexOf(element)
            );
          this.checkSearchSuggestions();
          this.isActive = false;
        });
    }
  }
  escapeHtml(unsafe) {
    const s = unsafe
      .replace(/#/g, '')
      .replace(/\\/g, '')
      .split('/')
      .join('');
    return s;
  }
  getThumbnailByName(item: string) {
    const nameIndex = this.searchSuggestions.names.indexOf(item);
    const thumb = this.searchSuggestions.thumbnails[nameIndex];
    return thumb;
  }

  extractTagNames(searchSuggestions: SearchSuggestionData) {
    const temp = [];
    searchSuggestions.tags.forEach(x => temp.push(JSON.parse(x)));
    this.tagNames = [].concat.apply([], temp);
    return this.tagNames.sort(x => x.confidence).map(tag => tag.name);
  }

  logOut() {
    this.auth
      .doLogout()
      .then((this.auth.token = null))
      .then(() => {
        this.auth.user = null;
        this.router.navigate(['/']);
        const cover = localStorage.getItem('favoriteCover');
        localStorage.clear();
        if (cover != null) {
          localStorage.setItem('favoriteCover', cover);
        }
      })
      .catch(e => {
        console.log('user is not signed in');
      });
  }

  ShowHideNotification() {
    this.IsShowNotify = !this.IsShowNotify;
  }

  getSearchHistory(id: number) {
    this.file
      .getSearchHistory(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(history => {
        this.searchHistory = history;
      });
  }

  find() {
    this.searchCriteria = this.escapeHtml(this.searchCriteria);
    if (this.searchCriteria.length === 0) {
      return;
    }
    this.searchHistory.unshift(this.searchCriteria);
    if (this.searchHistory.length > 5) {
      this.searchHistory.pop();
    }
    const id = localStorage.getItem('userId');
    this.http
      .findPhotos(id, this.searchCriteria)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        p => {
          this.shared.isSearchTriggeredAtLeastOnce = true;
          this.shared.isSearchTriggered = true;
          this.shared.foundPhotos = p;
          this.shared.searchCriteria = this.searchCriteria;
          this.searchCriteria = '';
          this.router.navigate(['main/photos']);
        },
        error => this.notifier.notify('error', 'Error find photos')
      );
  }

  restore() {
    this.file
      .receivePhoto()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        p => {
          this.shared.foundPhotos = p;
        },
        error => this.notifier.notify('error', 'Error restoring')
      );
  }

  sendItemToSearchbar(item: string) {
    this.searchCriteria = item;
    this.find();
    this.isSearchDropdownExpanded = false;
  }

  checkSearchSuggestions() {
    Object.values(this.searchSuggestions).forEach(field => {
      if (field.length > 0) {
        this.searchSuggestionsEmpty = false;
      } else {
        this.searchSuggestionsEmpty = false;
      }
    });
  }

  openModal(id: number) {
    this.duplicatesEntry.clear();
    const factory = this.resolver.resolveComponentFactory(
      DuplicatesModalComponent
    );
    const componentRef = this.duplicatesEntry.createComponent(factory);
    componentRef.instance.Change.subscribe(data => {
      this.deleteDuplicatesHandler(data);
    });
    componentRef.instance.receivedIds = this.duplicates;
    this.sendDelete(id);
    this.notification = this.notification.filter(i => i.id !== id);
    this.checkNotification(this.notification);
  }

  modalHandler(event) {
    // this.openModal();
  }

  markRead(id: number) {
    this.notification.find(i => i.id === id).isRead = true;
    this.checkNotification(this.notification);
  }

  openModalClicked() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(
      PhotoUploadModalComponent
    );
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.addToListEvent.subscribe(
      data => {
        this.router.navigate(['main/photos']);
        this.shared.photos.push(...data);
      },
      err => {
        this.notifier.notify('error', 'Error Uploading');
      }
    );
    componentRef.instance.toggleModal();
  }

  getCountOfUnreadNotifications() {
    return this.notification.filter(x => !x.isRead).length;
  }

  public sharedItemClicked(item: NotificationDTO) {
    const albumId = JSON.parse(item.payload);
    this.albumService
      .getAlbum(albumId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(album => {
        const navigationExtras: NavigationExtras = {
          state: {
            album: album.body
          }
        };
        this.router.navigate(
          ['/main/sharing', album.body.id],
          navigationExtras
        );
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
