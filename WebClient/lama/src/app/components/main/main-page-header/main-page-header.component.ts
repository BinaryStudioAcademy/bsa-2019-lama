import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SearchSuggestionData } from 'src/app/models/searchSuggestionData';
import { ImageTagDTO } from 'src/app/models/Photo/imageTagDTO';

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
  private resolver: ComponentFactoryResolver;
  avatarUrl: string;
  searchCriteria = '';
  isActive = false;
  searchHistory: string[];
  searchSuggestions: SearchSuggestionData;
  searchSuggestionsEmpty = true;
  id: number;
  timeout = null;
  objectKeys = Object.keys;
  unicodeSearch = '\u2315';
  unicodeLocation = '\u2316';
  isSearchDropdownExpanded: boolean;
  unsubscribe = new Subject();
  latestSearchAttempt = 0;
  tagNames = [];

  // constructors
  constructor(
    public auth: AuthService,
    private router: Router,
    resolver: ComponentFactoryResolver,
    private shared: SharedService,
    private http: HttpService,
    private file: FileService,
    private notifier: NotifierService
  ) {
    this.resolver = resolver;
  }

  async ngOnInit() {
    this.id = parseInt(localStorage.getItem('userId'), 10);
    while (!this.id) {
      await this.delay(500);
      this.id = parseInt(localStorage.getItem('userId'), 10);
    }
    this.getSearchHistory(this.id);
    this.http
      .getData(`users/${this.id}`)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        u => {
          if (u.photoUrl) {
            if (u.photoUrl.indexOf('base64') === -1) {
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
    this.searchCriteria.length < 1 || this.searchCriteria.length === this.latestSearchAttempt
      ? (this.isActive = false)
      : (this.isActive = true);
    if (this.isActive) {
      this.timeout = setTimeout(() => {
        this.getSearchSuggestions(this.id, this.searchCriteria);
      }, 300);
    }
  }

  showSearchDropdown() {
    this.isSearchDropdownExpanded = true;
  }

  hideSearchDropdown() {
    this.isSearchDropdownExpanded = false;
  }

  getSearchSuggestions(id: number, criteria: string) {
    if (this.searchCriteria.length > 0) {
      this.isActive = false;
      this.file
        .getSearchSuggestions(id, criteria)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(items => {
          this.latestSearchAttempt = criteria.length;
          this.searchSuggestions = items;
          this.checkSearchSuggestions();
          this.tagNames = this.extractTagNames(this.searchSuggestions)
                            .filter((tagname: string) => tagname.includes(criteria));
      });
    }
  }

  extractTagNames(searchSuggestions: SearchSuggestionData) {
    const temp = [];
    searchSuggestions.tags.forEach(x => temp.push(JSON.parse(x)));
    this.tagNames = [].concat.apply([], temp);
    return  this.tagNames.sort(x => x.confidence).map(tag => tag.name);
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

  getSearchHistory(id: number) {
    this.file
      .getSearchHistory(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(history => {
        this.searchHistory = history;
      });
  }

  find() {
    this.searchHistory.unshift(this.searchCriteria);
    if (this.searchHistory.length > 5) {
      this.searchHistory.pop();
    }
    const id = localStorage.getItem('userId');
    this.http.findPhotos(id, this.searchCriteria).subscribe(
      p => {
        this.shared.isSearchTriggeredAtLeastOnce = true;
        this.shared.isSearchTriggered = true;
        this.shared.foundPhotos = p;
      },
      error => this.notifier.notify('error', 'Error find photos')
    );
    this.searchCriteria = '';
  }

  restore() {
    this.file.receivePhoto().subscribe(
      p => {
        this.shared.foundPhotos = p;
      },
      error => this.notifier.notify('error', 'Error restoring')
    );
  }

  searchHistoryItemClicked(input: string) {
    console.log('1');
    console.log(input);
  }

  checkSearchSuggestions() {
    Object.values(this.searchSuggestions).forEach(field => {
      if (field.length > 0) {
        this.searchSuggestionsEmpty = false;
      }
    });
  }

  openModalClicked() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(
      PhotoUploadModalComponent
    );
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.addToListEvent.subscribe(
      data => {
        this.shared.photos.push(...data);
      },
      err => {
        this.notifier.notify('error', 'Error Uploading');
      }
    );
    componentRef.instance.toggleModal();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
