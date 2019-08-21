import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharingService } from 'src/app/services/sharing.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-share-by-link-modal',
  templateUrl: './share-by-link-modal.component.html',
  styleUrls: ['./share-by-link-modal.component.sass']
})
export class ShareByLinkModalComponent implements OnInit {


  @Input() receivedPhoto: PhotoRaw;

  @Output() Close = new EventEmitter();

  DISAPPEARING_TIMEOUT = 1000;
  sharedLink = '';
  imageUrl: string;
<<<<<<< HEAD
  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  sharingRoute: String = "main/shared";
=======
  copyClicked = false;
  sharedPhoto: SharedPhoto = {} as SharedPhoto;
  sharingRoute = 'main/shared';
>>>>>>> dev

  constructor(private sharingService: SharingService,
              private notifier: NotifierService) {

  }

  ngOnInit() {
    this.createShareableLink();

  }

  public cancel() {
    this.Close.emit(null);
  }

  public createShareableLink() {
      this.initInvariableFields();
      const encodedPhotoData = this.encodePhotoData(this.sharedPhoto);
      this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedPhotoData}`;
  }

<<<<<<< HEAD
  public copyShareableLink(){
    let selBox = document.createElement('textarea');
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
      this.notifier.notify( 'success', 'Link is now in your clipboard' );
=======
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
>>>>>>> dev
    }

    public encodePhotoData(photo: SharedPhoto): string {
      const encoded = btoa(JSON.stringify(photo)).replace('/', '___');
      console.log(encoded);
      return encoded;
    }

    private initInvariableFields() {
      this.sharedPhoto.photoId = this.receivedPhoto.id;
      this.sharedPhoto.sharedImageUrl = this.receivedPhoto.blobId;
      this.sharedPhoto.userId = this.receivedPhoto.userId;
    }

  }




