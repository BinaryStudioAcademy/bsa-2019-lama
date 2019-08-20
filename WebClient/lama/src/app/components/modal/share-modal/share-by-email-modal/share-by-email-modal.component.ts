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

  @Output() onClose = new EventEmitter();

  DISAPPEARING_TIMEOUT: number = 1000;
  sharedLink: string = '';
  sharedEmail: string = '';
  imageUrl: string;
  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  userEmails: Array<string> = [];
  sharingRoute: String = "main/shared";
  showSuccessIcon: boolean = false;

  constructor(private userService: UserService,
    private notifier: NotifierService) {

  }

  ngOnInit() {
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public AddEmail(){
    this.userService.getUserByEmail(this.sharedEmail).subscribe(user => {
	  if(user.email)
      {
		this.userEmails.push(user.email);
		this.showSuccessIcon = true;
      }
      else
      {
		this.showSuccessIcon = false;
      }
	});
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
      this.notifier.notify( 'success', 'Link is now in your clipboard' );
    }

    public encodePhotoData(photo: SharedPhoto): string{
      let encoded = btoa(JSON.stringify(photo)).replace("/","___");
      encoded += btoa(JSON.stringify(this.userEmails)).replace("/","___");
      console.log(encoded);
      return encoded;
    }

    private initInvariableFields(){
      this.sharedPhoto.photoId = this.receivedPhoto.id;
      this.sharedPhoto.sharedImageUrl = this.receivedPhoto.blobId;
      this.sharedPhoto.userId = this.receivedPhoto.userId;
    }
	
	public GenerateClick() {
		this.createShareableLink();
	}

  }