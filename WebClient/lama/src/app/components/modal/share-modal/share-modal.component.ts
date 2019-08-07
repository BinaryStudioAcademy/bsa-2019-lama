import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharingService } from 'src/app/services/sharing.service';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.sass']
})
export class ShareModalComponent implements OnInit {

  @Input() photoId: number = 1;
  @Output() onClose = new EventEmitter();

  photoDocument:PhotoRaw = <PhotoRaw>{};
  shareableLink: string = '';
  imageUrl: string;
  copyClicked: boolean = false;

  constructor(private sharingService: SharingService) {

  }

  ngOnInit() {
    this.getImageById(this.photoId);
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public createShareableLink(){
    let userdata = this.encodeUserData();
    this.shareableLink = `${environment.clientUrl}/shared/${userdata}`;
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
      this.copyClicked = !this.copyClicked;
    }

    public getImageById(photoId: number){
      this.sharingService.getPhotoEntity(photoId).subscribe(photo => {
        this.photoDocument =photo;
        this.createShareableLink();
      })
    }

    public encodeUserData(): string{
      let encoded = btoa(JSON.stringify(this.photoDocument)).replace("/","___");
      console.log(encoded);
      return encoded;
    }

  }




