import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  DoCheck,
  OnDestroy
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoRaw } from 'src/app/models';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { AlbumService } from 'src/app/services/album.service';
import { ZipService } from 'src/app/services/zip.service';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { User } from 'src/app/models/User/user';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shared-page-album',
  templateUrl: './shared-page-album.component.html',
  styleUrls: ['./shared-page-album.component.sass']
})
export class SharedPageAlbumComponent implements OnInit, DoCheck, OnDestroy {
  @Input() album: ViewAlbum = {} as ViewAlbum;

  sharedAlbum: SharedAlbum = {} as SharedAlbum;
  AlbumId: number;
  loading = false;
  selectedPhotos: PhotoRaw[];
  isAtLeastOnePhotoSelected = false;
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  currentUser: User;
  unsubscribe = new Subject();

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private zipService: ZipService,
    private resolver: ComponentFactoryResolver
  ) {
    this.decodeUserData();
  }

  ngOnInit() {
    const userId: number = parseInt(localStorage.getItem('userId'), 10);
    this.selectedPhotos = [];
    this.albumService.getAlbum(this.sharedAlbum.albumId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
      this.album = x.body;
    });
    this.loading = true;
  }

  photoClicked(eventArgs: PhotoRaw) {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.currentUser = this.currentUser;
  }

  ngDoCheck() {
    this.isAtLeastOnePhotoSelected = this.selectedPhotos.length > 0;
  }

  photoSelected(eventArgs: PhotoRawState) {
    if (eventArgs.isSelected) {
      this.selectedPhotos.push(eventArgs.photo);
    } else {
      const index = this.selectedPhotos.indexOf(eventArgs.photo);
      this.selectedPhotos.splice(index, 1);
    }
  }

  downloadImages() {
    this.zipService.downloadImages(this.selectedPhotos);
  }

  private decodeUserData() {
    const encodedData = this.route.snapshot.params.userdata as string;
    let jsonData = atob(encodedData.replace('___', '/'));
    jsonData = jsonData.replace('[]', '');
    this.sharedAlbum = JSON.parse(jsonData);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
