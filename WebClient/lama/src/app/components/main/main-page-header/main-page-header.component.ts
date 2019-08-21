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

  public showSidebarMenu: boolean;

  // constructors
  constructor(
    public auth: AuthService,
    private router: Router,
    resolver: ComponentFactoryResolver,
    private shared: SharedService,
    private http: HttpService,
    private file: FileService
  ) {
    this.resolver = resolver;
  }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (id) {
      this.http
        .getData(`users/${localStorage.getItem('userId')}`)
        .subscribe(u => {
          this.avatarUrl = u.photoUrl;
        });
    } else {
      this.avatarUrl = this.auth.user.photo.imageUrl;
    }
  }

  ngDoCheck() {
    if (this.shared.avatar != null) {
      this.file.getPhoto(this.shared.avatar.imageUrl).subscribe(url => {
        this.avatarUrl = url;
      });
    }

    this.searchCriteria.length < 3
      ? (this.isActive = false)
      : (this.isActive = true);
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

  public find() {
    this.http.findPhotos(this.searchCriteria).subscribe(p => {
      this.shared.isSearchTriggeredAtLeastOnce = true;
      this.shared.isSearchTriggered = true;
      this.shared.foundedPhotos = p;
    });
  }

  public restore() {
    this.file.receivePhoto().subscribe(p => {
      this.shared.foundedPhotos = p;
    });
  }

  public openModalClicked() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(
      PhotoUploadModalComponent
    );
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.addToListEvent.subscribe(data =>
      this.shared.photos.push(...data)
    );
    componentRef.instance.toggleModal();
  }

  public onMenuClicked(event) {
    this.showSidebarMenu = !this.showSidebarMenu;
    this.Click.emit(this.showSidebarMenu);
  }
}
