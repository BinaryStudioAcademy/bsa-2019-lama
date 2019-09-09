import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileService } from 'src/app/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { User } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';
import { Album } from 'src/app/models/Album/album';
import { NavigationExtras, Router } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';
import { NotifierService } from 'angular-notifier';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.sass']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  categoryAlbums: ViewAlbum[];
  showSpinner = true;
  hasAnyItems = true;
  currentUser: User;
  ArchivePhotos: any;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private notifier: NotifierService,
    private albumService: AlbumService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.httpService
      .getData('users/' + userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(u => {
        this.currentUser = u;
      });
    this.fileService
      .getUserPhotosCategorized()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(receivedData => {
        this.categoryAlbums = receivedData.map(
          photoCategory =>
            new ViewAlbum(
              -1,
              photoCategory.category,
              photoCategory.photos[0],
              photoCategory.photos,
              this.currentUser
            )
        );
        this.showSpinner = false;
      });
  }

  albumClicked(eventArgs: Album) {
    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(
      ['main/categories', eventArgs.title],
      navigationExtras
    );
  }

  archiveAlbum(event: ViewAlbum) {
    if (event.photoAlbums) {
      const NameOfFiles = [];
      for (const item of event.photoAlbums) {
        NameOfFiles.push(item.originalBlobId);
      }
      this.albumService
        .ArchiveAlbum(NameOfFiles)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          x => {
            this.ArchivePhotos = x;
            this.convertToImage(event.title);
          },
          error => this.notifier.notify('error', 'Error archive album')
        );
    } else {
      this.notifier.notify('error', 'Cannot download the empty album');
    }
  }

  convertToImage(name) {
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
