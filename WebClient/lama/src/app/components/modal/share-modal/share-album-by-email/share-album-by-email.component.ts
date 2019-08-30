import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { User } from 'src/app/models/User/user';
import { HttpService } from 'src/app/services/http.service';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { UserService } from 'src/app/services/user.service';
import { NotifierService } from 'angular-notifier';
import { SharingService } from 'src/app/services/sharing.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-share-album-by-email',
  templateUrl: './share-album-by-email.component.html',
  styleUrls: ['./share-album-by-email.component.sass']
})
export class ShareAlbumByEmailComponent implements OnInit, OnDestroy {
  @Input() receivedAlbum: ViewAlbum;

  @Output() Close = new EventEmitter();

  DISAPPEARING_TIMEOUT = 1000;
  sharedLink = '';
  sharedEmail = '';
  imageUrl: string;
  sharedAlbum: SharedAlbum = {} as SharedAlbum;
  userEmails: Array<string> = [];
  userIds: number[] = [];
  sharingRoute = 'main/shared/album';
  wrongInput = false;
  availableAll = true;
  showAvailable = false;
  unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    private notifier: NotifierService,
    private sharingService: SharingService
  ) {}

  ngOnInit() {}

  public cancel() {
    this.Close.emit(null);
  }

  public AddEmail() {
    if (this.sharedEmail && this.isEmail(this.sharedEmail)) {
      this.userService
        .getUserByEmail(this.sharedEmail)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          user => {
            if (user) {
              this.userEmails.push(user.email);
              this.userIds.push(user.id);
              this.wrongInput = false;
              this.clearInput();
            } else {
              this.wrongInput = true;
              this.notifier.notify('error', 'Error getting email');
            }
          },
          error => this.notifier.notify('error', 'Error getting email')
        );
    } else {
      this.wrongInput = true;
      this.notifier.notify('error', 'Incorrect input');
    }
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
    this.notifier.notify('success', 'Link is now in your clipboard');
    this.sharedLink = null;
  }

  removeEmail(email: string) {
    this.userEmails = this.userEmails.filter(i => i !== email);
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
    this.showAvailable = true;
    if (this.userEmails.length) {
      this.availableAll = false;
      this.userIds.forEach(item => {
        this.sharingService
          .sendSharedAlbum({
            albumId: this.sharedAlbum.albumId,
            userId: item
          })
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(e => console.log(e));
      });
    } else {
      this.availableAll = true;
    }
    if (this.availableAll && this.showAvailable) {
      this.notifier.notify('success', 'Link is available to all');
    } else if (!this.availableAll && this.showAvailable) {
      this.notifier.notify('success', 'Link is sent to specified users');
    }
    this.userEmails = [];
    this.userIds = [];
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
