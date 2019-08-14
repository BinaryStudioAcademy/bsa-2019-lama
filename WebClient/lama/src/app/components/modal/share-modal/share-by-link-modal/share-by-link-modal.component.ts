import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-share-by-link-modal',
  templateUrl: './share-by-link-modal.component.html',
  styleUrls: ['./share-by-link-modal.component.sass']
})
export class ShareByLinkModalComponent implements OnInit {


  @Input() receivedPhoto: PhotoRaw;

  @Output() onClose = new EventEmitter();

  DISAPPEARING_TIMEOUT: number = 1000; //1 second
  sharedLink: string = '';
  imageUrl: string;
  copyClicked: boolean = false;
  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  sharingRoute: String = "main/shared";

  constructor(private sharingService: SharingService) {

  }

  ngOnInit() {
    this.createShareableLink();

  }

  public cancel(){
    this.onClose.emit(null);
  }

  public createShareableLink(){
      this.initInvariableFields();
      let encodedPhotoData = this.encodePhotoData(this.sharedPhoto);
      this.sharedLink = `${environment.clientApiUrl}/${this.sharingRoute}/${encodedPhotoData}`;
  }

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
      this.copyClicked = !this.copyClicked;

      setTimeout(() => this.copyClicked = !this.copyClicked,this.DISAPPEARING_TIMEOUT);
    }

    public encodePhotoData(photo: SharedPhoto): string{
      let encoded = btoa(JSON.stringify(photo)).replace("/","___");
      console.log(encoded);
      return encoded;
    }

    private initInvariableFields(){
      this.sharedPhoto.photoId = this.receivedPhoto.id;
      this.sharedPhoto.sharedImageUrl = this.receivedPhoto.blobId;
      this.sharedPhoto.userId = this.receivedPhoto.userId;
    }

  }




