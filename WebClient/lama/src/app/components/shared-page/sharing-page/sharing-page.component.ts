import { Component, OnInit } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { User } from 'src/app/models/User/user';
import { SharingService } from 'src/app/services/sharing.service';
import { HttpService } from 'src/app/services/http.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sharing-page',
  templateUrl: './sharing-page.component.html',
  styleUrls: ['./sharing-page.component.sass']
})
export class SharingPageComponent implements OnInit {
  albums: ViewAlbum[];
  currentUser: User;
  constructor(
    private sharingService: SharingService,
    private httpService: HttpService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.httpService.getData('users/' + userId).subscribe(
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
      .subscribe(albums => {
        this.albums = albums;
        console.log(this.albums);
      });
  }
}
