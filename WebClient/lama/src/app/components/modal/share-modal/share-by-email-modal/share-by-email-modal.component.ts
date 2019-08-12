import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedPhoto } from 'src/app/models/Photo/sharedPhoto';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { User } from 'src/app/models/User/user';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-share-by-email-modal',
  templateUrl: './share-by-email-modal.component.html',
  styleUrls: ['./share-by-email-modal.component.sass']
})
export class ShareByEmailModalComponent implements OnInit {


  @Input() receivedPhoto: PhotoRaw;

  @Output() onClose = new EventEmitter();

  sharedLink: string = '';
  sharedEmail: string = '';
  imageUrl: string;
  copyClicked: boolean = false;
  sharedPhoto: SharedPhoto = <SharedPhoto>{};
  userEmails: Array<string>;

  constructor(private httpService: HttpService) {

  }

  ngOnInit() {
  }

  public cancel(){
    this.onClose.emit(null);
  }

  public AddEmail(){
	let user: User;
	this.httpService.getData(`users/${this.sharedEmail}`).subscribe((data:User) => user = data);
    if(user.email)
    {
		this.userEmails.push(user.email);
		this.DisplaySuccesIcon();
    }
    else
    {
		this.DisplayFailureIcon();
    }
  }
  
  DisplaySuccesIcon() {
	let succesIconColor = document.getElementById('success-icon-color');
	succesIconColor.classList.remove('has-text-danger');
	succesIconColor.classList.add('has-text-success');
		
	let succesIcon = document.getElementById('success-icon');
	succesIcon.classList.remove('fa-times');
	succesIcon.classList.add('fa-check');
  }
  
  DisplayFailureIcon() {
	let succesIconColor = document.getElementById('success-icon-color');
	succesIconColor.classList.remove('has-text-success');
	succesIconColor.classList.add('has-text-danger');
		
	let succesIcon = document.getElementById('success-icon');
	succesIcon.classList.remove('fa-check');
	succesIcon.classList.add('fa-times');
  }
  
	public createShareableLink(){
      this.initInvariableFields();
      let encodedPhotoData = this.encodePhotoData(this.sharedPhoto);
      this.sharedLink = `${environment.clientApiUrl}/shared/${encodedPhotoData}`;
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