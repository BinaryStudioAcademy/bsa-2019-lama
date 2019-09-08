import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { User } from 'src/app/models/User/user';
import { SharingService } from 'src/app/services/sharing.service';
import { HttpService } from 'src/app/services/http.service';
import { NotifierService } from 'angular-notifier';
import { Album } from 'src/app/models/Album/album';
import { Router, NavigationExtras } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sharing-page',
  templateUrl: './sharing-page.component.html',
  styleUrls: ['./sharing-page.component.sass']
})
export class SharingPageComponent implements OnInit, OnDestroy {
  albums: ViewAlbum[] = [];
  currentUser: User;
  ArchivePhotos = [];
  showSpinner = true;
  unsubscribe = new Subject();
  isAnyItems = true;
  constructor(
    private sharingService: SharingService,
    private httpService: HttpService,
    private notifier: NotifierService,
    private router: Router,
    private albumService: AlbumService
  ) {}

  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.httpService
      .getData('users/' + userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        u => {
          this.currentUser = u;
          this.getSharedAlbums();
        },
        error => this.notifier.notify('error', 'Error loading user')
      );
  }

  getSharedAlbums() {
    this.sharingService
      .getSharedAlbums(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(albums => {
        this.albums = albums;
        if (!this.albums.length) {
          this.isAnyItems = false;
        }
        this.showSpinner = false;
      });
  }

  public albumClicked(eventArgs: Album) {
    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['/main/sharing', eventArgs.id], navigationExtras);
  }
  public deleteAlbumHandler(albumToDelete: ViewAlbum) {
    if (albumToDelete.id === 0) {
      localStorage.removeItem('favoriteCover');
    } else {
      this.albums = this.albums.filter(a => a !== albumToDelete);
    }
  }
  ArchiveAlbum(event: ViewAlbum) {
    if (event.photoAlbums) {
      const NameOfFiles = [];
      for (const item of event.photoAlbums) {
        NameOfFiles.push(item.originalBlobId);
      }
      this.albumService.ArchiveAlbum(NameOfFiles).subscribe(
        x => {
          this.ArchivePhotos = x;
          this.ConvertToImage(event.title);
        },
        error => this.notifier.notify('error', 'Error archive album')
      );
    } else {
      this.notifier.notify('error', 'Cannot download the empty album');
    }
  }
  ConvertToImage(name) {
    const zip = new JSZip();
    for (let i = 0; i < this.ArchivePhotos.length; i++) {
      zip.file(`image${i + 1}.jpg`, this.ArchivePhotos[i], { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, name);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
