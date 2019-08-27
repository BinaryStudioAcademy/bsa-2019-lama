import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ElementRef,
  Output,
  EventEmitter,
  DoCheck
} from '@angular/core';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { HttpService } from 'src/app/services/http.service';
import { FileService } from 'src/app/services';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifierService } from 'angular-notifier';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.sass']
})
export class MainPageHeaderComponent implements OnInit, DoCheck {
  @Output() Click = new EventEmitter<boolean>();
  @ViewChild('photoUploadModal', { static: true, read: ViewContainerRef })
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;
  public avatarUrl;
  public searchCriteria = '';
  public isActive = false;
  searchHistory: string[];
  searchSuggestions: { [name: string]: string[] } = {};
  id: number;
  timeout = null;
  objectKeys = Object.keys;
  unicodeSearch = '\u2315';
  unicodeLocation = '\u2316';

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
    this.http.getData(`users/${this.id}`).subscribe(
      u => {
        if (u.photoUrl) {
          if (u.photoUrl.indexOf('base64') === -1) {
            this.file
              .getPhoto(u.photoUrl)
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
          this.file.getPhoto(this.shared.avatar.imageUrl).subscribe(url => {
            this.avatarUrl = url;
          });
        } else {
          this.avatarUrl = this.shared.avatar.imageUrl;
        }
        this.shared.avatar = null;
      }
    }
    this.searchCriteria.length < 1
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

  getSearchSuggestions(id: number, criteria: string) {
    if (this.isActive) {
      this.file
        .getSearchSuggestions(this.id, this.searchCriteria)
        .subscribe(items => {
          this.searchSuggestions = items;
        });
      console.log(this.searchSuggestions);
    }
  }

  public logOut() {
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
    this.file.getSearchHistory(id).subscribe(history => {
      this.searchHistory = history;
    });
  }

  public find() {
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

  public restore() {
    this.file.receivePhoto().subscribe(
      p => {
        this.shared.foundPhotos = p;
      },
      error => this.notifier.notify('error', 'Error restoring')
    );
  }

  public openModalClicked() {
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
}
