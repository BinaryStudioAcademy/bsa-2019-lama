import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-share-by-email-modal',
  templateUrl: './share-by-email-modal.component.html',
  styleUrls: ['./share-by-email-modal.component.sass']
})
export class ShareByEmailModalComponent implements OnInit {


  @Input() receivedPhoto: PhotoRaw;

  @Output() onClose = new EventEmitter();


  sharedEmail: string = '';
  imageUrl: string;
  sharedPhoto: SharedPhoto = <SharedPhoto>{};

  incorrectEmailIconUrl: string = "http://img.clipartlook.com/red-cross-mark-clipart-red-x-mark-icon-256.png";
  correctEmailIconUrl: string = "https://www.erwinchryslerdodgejeep.com/wp-content/plugins/pm-motors-plugin/modules/vehicle_save/images/check.png";
  resultCheckCorrectUrl: string = this.incorrectEmailIconUrl;

  constructor() {

  }

  ngOnInit() {
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public AddEmail(){
    if(this.sharedEmail)
    {
      this.resultCheckCorrectUrl = this.correctEmailIconUrl;
    }
    else
    {
      this.resultCheckCorrectUrl = this.incorrectEmailIconUrl;
    }
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