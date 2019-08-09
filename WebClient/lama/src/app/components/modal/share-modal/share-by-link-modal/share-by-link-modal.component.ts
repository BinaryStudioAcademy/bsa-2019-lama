import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-share-by-link-modal',
  templateUrl: './share-by-link-modal.component.html',
  styleUrls: ['./share-by-link-modal.component.sass']
})
export class ShareByLinkModalComponent implements OnInit {


  @Input() receivedPhoto: PhotoRaw;

  @Output() onClose = new EventEmitter();


  sharedLink: string = '';
  imageUrl: string;
  copyClicked: boolean = false;
  sharedPhoto: SharedPhoto = <SharedPhoto>{};

  constructor() {

  }

  ngOnInit() {
    this.createShareableLink();
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public createShareableLink(){
    if(this.receivedPhoto.sharedLink !== null){
      this.sharedLink = `${environment.clientApiUrl}/shared/${this.receivedPhoto.sharedLink}`;
    }
    else{
      this.initImmutableFields();
      let encodedPhotoData = this.encodePhotoData(this.sharedPhoto);
      this.sharedLink = `${environment.clientApiUrl}/shared/${encodedPhotoData}`;
    }
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
    }

    public encodePhotoData(photo: SharedPhoto): string{
      let encoded = btoa(JSON.stringify(photo)).replace("/","___");
      console.log(encoded);
      return encoded;
    }

    private initImmutableFields(){
      this.sharedPhoto.photoId = this.receivedPhoto.id;
      this.sharedPhoto.sharedImageUrl = this.receivedPhoto.blobId;
      this.sharedPhoto.userId = this.receivedPhoto.userId;
    }

  }




