import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharingService } from 'src/app/services/sharing.service';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.sass']
})
export class ShareModalComponent implements OnInit {

  //temporary mocked data, when database will be set up, we will get this data on page loading and pass it from photo page component
  @Input() sharedPhoto: SharedPhoto = <SharedPhoto>{photoId:1, sharedImageUrl:"https://icon-library.net/images/alpaca-icon/alpaca-icon-19.jpg", userId:1};
  @Output() onClose = new EventEmitter();

  sharedLink: string = '';
  imageUrl: string;
  copyClicked: boolean = false;

  constructor() {

  }

  ngOnInit() {
    //this.getImageById(this.sharedPhoto.photoId);
    this.createShareableLink();
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public createShareableLink(){
    let userdata = this.encodeUserData();
    this.sharedLink = `${environment.clientUrl}/shared/${userdata}`;
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

    // public getImageById(photoId: number){
    //   this.sharingService.getPhotoEntity(photoId).subscribe(photo => {
    //     if(photo.sharedImageUrl){
    //       this.sharedLink = photo.sharedImageUrl;
    //       return;
    //     }
    //     this.sharedPhoto = photo;
    //     this.createShareableLink();
    //   })
    // }

    public encodeUserData(): string{
      let encoded = btoa(JSON.stringify(this.sharedPhoto)).replace("/","___");
      console.log(encoded);
      return encoded;
    }

  }




