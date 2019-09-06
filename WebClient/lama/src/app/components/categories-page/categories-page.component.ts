import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileService } from 'src/app/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PhotoCategory } from 'src/app/models/photoCategory';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw, User } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';
import { Album } from 'src/app/models/Album/album';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.sass']
})
export class CategoriesPageComponent implements OnInit {
  unsubscribe = new Subject();
  categoryAlbums: ViewAlbum[];
  showSpinner = true;
  currentUser: User;
  constructor(
    private httpService: HttpService,
    private router: Router,
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
              photoCategory.photos
            )
        );
        this.showSpinner = false;
      });
  }
  // ngOnDestroy() {
  //   this.unsubscribe.next();
  //   this.unsubscribe.unsubscribe();
  // }

  albumClicked(eventArgs: Album) {
    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['main/categories', eventArgs.id], navigationExtras);
  }
}
