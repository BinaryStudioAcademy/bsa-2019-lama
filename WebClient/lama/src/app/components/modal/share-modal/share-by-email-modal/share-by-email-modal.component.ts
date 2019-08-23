import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { User } from 'src/app/models/User/user';
import { UserService } from 'src/app/services/user.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-share-by-email-modal',
  templateUrl: './share-by-email-modal.component.html',
  styleUrls: ['./share-by-email-modal.component.sass']
})
export class ShareByEmailModalComponent implements OnInit {
  @Input() receivedPhoto: PhotoRaw;

  @Output() Close = new EventEmitter();

  DISAPPEARING_TIMEOUT = 1000;
  sharedLink = '';
  sharedEmail = '';
  imageUrl: string;
  sharedPhoto: SharedPhoto = {} as SharedPhoto;
  userEmails: Array<string> = [];
  sharingRoute = 'main/shared';
  wrongInput = false;
  showAvailable = false;
  availableAll = true;

  constructor(
    private userService: UserService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {}

  public cancel() {
    this.Close.emit(null);
  }

  public AddEmail() {
    if (this.sharedEmail && this.isEmail(this.sharedEmail)) {
      this.userService.getUserByEmail(this.sharedEmail).subscribe(user => {
        if (user.email) {
          this.userEmails.push(user.email);
          this.wrongInput = false;
          this.clearInput();
        } else {
          this.wrongInput = true;
        }
      },
      error => this.notifier.notify('error', 'Error getting email'));
    } else {
      this.wrongInput = true;
    }
  }

  public createShareableLink() {
    this.initInvariableFields();
    const encodedPhotoData = this.encodePhotoData(this.sharedPhoto);
    this.sharedLink = `${environment.clientApiUrl}/${
      this.sharingRoute
    }/${encodedPhotoData}`;
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
    this.notifier.notify('success', 'Link is now in your clipboard');
  }

  public encodePhotoData(photo: SharedPhoto): string {
    let encoded = btoa(JSON.stringify(photo)).replace('/', '___');
    encoded += btoa(JSON.stringify(this.userEmails)).replace('/', '___');
    console.log(encoded);
    return encoded;
  }

  private initInvariableFields() {
    this.sharedPhoto.photoId = this.receivedPhoto.id;
    this.sharedPhoto.sharedImageUrl = this.receivedPhoto.blobId;
    this.sharedPhoto.userId = this.receivedPhoto.userId;
  }

  public GenerateClick() {
    if (this.userEmails.length) {
      this.availableAll = false;
    }
    this.showAvailable = true;
    this.createShareableLink();
  }

  clearInput() {
    this.sharedEmail = '';
  }

  isEmail(search: string) {
    let serchfind: boolean;
    const regexp = new RegExp(
      // tslint:disable-next-line: max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    serchfind = regexp.test(search);

    return serchfind;
  }
}
