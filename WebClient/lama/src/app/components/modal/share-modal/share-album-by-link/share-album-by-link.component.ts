import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { User } from 'src/app/models/User/user';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-share-album-by-link',
  templateUrl: './share-album-by-link.component.html',
  styleUrls: ['./share-album-by-link.component.sass']
})
export class ShareAlbumByLinkComponent implements OnInit {
  @Input() receivedAlbum: ViewAlbum;

  @Output() Close = new EventEmitter();

  DISAPPEARING_TIMEOUT = 1000;
  sharedLink = '';
  imageUrl: string;
<<<<<<< HEAD
  sharedAlbum: SharedAlbum = <SharedAlbum>{};
  sharingRoute: String = "main/shared/album";
  showSuccessIcon: boolean = false;
=======
  copyClicked = false;
  sharedAlbum: SharedAlbum = {} as SharedAlbum;
  sharingRoute = 'main/shared/album';
  showSuccessIcon = false;
>>>>>>> dev

  constructor(private notifier: NotifierService) {

  }

  ngOnInit() {
    this.createShareableLink();
  }

  public cancel() {
<<<<<<< HEAD
    this.onClose.emit(null);
  }

  public createShareableLink() {
    this.initInvariableFields();
    const encodedAlbumData = this.encodeAlbumData(this.sharedAlbum);
    this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedAlbumData}`;
  }


  public copyShareableLink() {
    const selBox = document.createElement('textarea');
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
    this.notifier.notify('success', 'Link is now in your clipboard');
  }

  public encodeAlbumData(album: SharedAlbum): string {
    let encoded = btoa(JSON.stringify(album)).replace('/', '___');
    return encoded;
  }

  private initInvariableFields() {
    this.sharedAlbum.albumId = this.receivedAlbum.id;
    this.sharedAlbum.userId = this.receivedAlbum.photo.userId;
  }
=======
    this.Close.emit(null);
  }

  public createShareableLink() {
      this.initInvariableFields();
      const encodedAlbumData = this.encodeAlbumData(this.sharedAlbum);
      this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedAlbumData}`;
  }

  public copyShareableLink() {
    const selBox = document.createElement('textarea');
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
    this.copyClicked = !this.copyClicked;
    setTimeout(() => this.copyClicked = !this.copyClicked, this.DISAPPEARING_TIMEOUT);
    }

    public encodeAlbumData(album: SharedAlbum): string {
      const encoded = btoa(JSON.stringify(album)).replace('/', '___');
      console.log(encoded);
      return encoded;
    }

    private initInvariableFields() {
      this.sharedAlbum.albumId = this.receivedAlbum.id;
      this.sharedAlbum.userId = this.receivedAlbum.photo.userId;
    }
>>>>>>> dev
}
