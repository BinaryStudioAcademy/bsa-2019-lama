import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharingService } from 'src/app/services/sharing.service';
import { SharingUserData } from 'src/app/models/User/SharingUserData';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.sass']
})
export class ShareModalComponent implements OnInit {

  @Output() onClose = new EventEmitter();

  sharingUserData: SharingUserData = new SharingUserData();
  shareableLink: string = '';
  imageUrl: string;
  constructor(private sharingService: SharingService) {
    console.log("temporary measure at ShareModalComponent constructor");

    this.sharingUserData.userId;

  }

  ngOnInit() {
    this.createShareableLink();


  }

  public cancel(){
    this.onClose.emit(null);
  }

  public createShareableLink(){
    this.getImage();
    this.encodeUserData();
    this.shareableLink = `${environment.clientUrl}/shared`;
  }

  public copyShareableLink(){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.shareableLink;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      console.log(`${this.shareableLink} was copied`);
    }

    public getImage(){
      this.sharingService.getSharableLink().subscribe(blob => {
        this.sharingUserData.sharedImageUrl = URL.createObjectURL(blob);
      })
    }

    public encodeUserData(): string{
      console.log( btoa(JSON.stringify(this.sharingUserData)));
      return btoa(JSON.stringify(this.sharingUserData));
    }

  }




