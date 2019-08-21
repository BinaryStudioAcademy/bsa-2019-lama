import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { User } from 'src/app/models/User/user';
import { HttpService } from 'src/app/services/http.service';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { UserService } from 'src/app/services/user.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-share-album-by-email',
  templateUrl: './share-album-by-email.component.html',
  styleUrls: ['./share-album-by-email.component.sass']
})
export class ShareAlbumByEmailComponent implements OnInit {

  @Input() receivedAlbum: ViewAlbum;

  @Output() Close = new EventEmitter();

  DISAPPEARING_TIMEOUT = 1000;
  sharedLink = '';
  sharedEmail = '';
  imageUrl: string;
<<<<<<< HEAD
  sharedAlbum: SharedAlbum = <SharedAlbum>{};
=======
  copyClicked = false;
  sharedAlbum: SharedAlbum = {} as SharedAlbum;
>>>>>>> dev
  userEmails: Array<string> = [];
  sharingRoute = 'main/shared/album';
  showSuccessIcon = false;

  constructor(private userService: UserService,
    private notifier: NotifierService) {

  }

  ngOnInit() {
  }

  public cancel() {
<<<<<<< HEAD
    this.onClose.emit(null);
=======
    this.Close.emit(null);
>>>>>>> dev
  }

  public AddEmail() {
    this.userService.getUserByEmail(this.sharedEmail).subscribe(user => {
      if (user.email) {
        this.userEmails.push(user.email);
        this.showSuccessIcon = true;
<<<<<<< HEAD
      }
      else {
        this.showSuccessIcon = false;
      }
    });
  }

  public createShareableLink() {
    this.initInvariableFields();
    let encodedAlbumData = this.encodeAlbumData(this.sharedAlbum);
    this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedAlbumData}`;
=======
      } else {
        this.showSuccessIcon = false;
      }
  });
  }

  public createShareableLink() {
      this.initInvariableFields();
      const encodedAlbumData = this.encodeAlbumData(this.sharedAlbum);
      this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedAlbumData}`;
>>>>>>> dev
  }


  public copyShareableLink() {
<<<<<<< HEAD
    let selBox = document.createElement('textarea');
=======
    const selBox = document.createElement('textarea');
>>>>>>> dev
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.sharedLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    console.log(`${this.sharedLink} was copied`);
<<<<<<< HEAD
    this.notifier.notify('success', 'Link is now in your clipboard');
  }

  public encodeAlbumData(album: SharedAlbum): string {
    let encoded = btoa(JSON.stringify(album)).replace('/', '___');
    encoded += btoa(JSON.stringify(this.userEmails)).replace('/', '___');
    console.log(encoded);
    return encoded;
  }

  private initInvariableFields() {
    this.sharedAlbum.albumId = this.receivedAlbum.id;
    this.sharedAlbum.userId = this.receivedAlbum.photo.userId;
  }

  public GenerateClick() {
    this.createShareableLink();
  }
=======
    this.copyClicked = !this.copyClicked;
    setTimeout(() => this.copyClicked = !this.copyClicked, this.DISAPPEARING_TIMEOUT);
    }

    public encodeAlbumData(album: SharedAlbum): string {
      let encoded = btoa(JSON.stringify(album)).replace('/', '___');
      encoded += btoa(JSON.stringify(this.userEmails)).replace('/', '___');
      console.log(encoded);
      return encoded;
    }

    private initInvariableFields() {
      this.sharedAlbum.albumId = this.receivedAlbum.id;
      this.sharedAlbum.userId = this.receivedAlbum.photo.userId;
    }
    public GenerateClick() {
      this.createShareableLink();
    }
>>>>>>> dev

}
