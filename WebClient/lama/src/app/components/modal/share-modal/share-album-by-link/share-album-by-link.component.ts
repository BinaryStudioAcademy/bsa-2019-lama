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

  @Output() onClose = new EventEmitter();

  DISAPPEARING_TIMEOUT: number = 1000;
  sharedLink: string = '';
  imageUrl: string;
  sharedAlbum: SharedAlbum = <SharedAlbum>{};
  sharingRoute: String = "main/shared/album";
  showSuccessIcon: boolean = false;

  constructor(private notifier: NotifierService) {

  }

  ngOnInit() {
    this.createShareableLink();
  }

  public cancel() {
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
}
