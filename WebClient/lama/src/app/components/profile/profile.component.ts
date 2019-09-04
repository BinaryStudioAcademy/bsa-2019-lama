import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { FileService } from 'src/app/services';
import { NotifierService } from 'angular-notifier';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    public authService: AuthService,
    private httpService: HttpService,
    private userService: UserService,
    private sharedService: SharedService,
    private notifier: NotifierService,
    private fileService: FileService
  ) {}

  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultImageUrl: string;

  userForm: FormGroup;
  user: User = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    photo: { imageUrl: '', description: '' }
  };
  isSuccesfull = true;
  photoUrl: string;
  testReceivedUser: User;
  showSpinner = true;
  isPhotoLoaded = false;
  isSaved = false;
  unsubscribe = new Subject();

  ngOnInit() {
    this.httpService
      .getData(`users/${localStorage.getItem('userId')}`)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        u => {
          this.isSuccesfull = true;
          this.user = u;
          if (u.photoUrl && u.photoUrl.indexOf('base64') === -1) {
            this.showSpinner = false;
            this.fileService
              .getPhoto(u.photoUrl)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(url => {
                this.photoUrl = url;
                this.defaultImageUrl = this.photoUrl;
              });
          } else if (u.photoUrl) {
            this.showSpinner = false;
            this.photoUrl = u.photoUrl;
          } else {
            this.showSpinner = false;
            this.photoUrl = null;
          }
          this.defaultEmail = this.user.email;
          this.defaultLastName = this.user.lastName;
          this.defaultFirstName = this.user.firstName;
        },
        err => {
          this.notifier.notify('error', 'Error loading');
          this.showSpinner = false;
          this.isSuccesfull = false;
        }
      );

    this.userForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, Validators.required),
      lastName: new FormControl(this.user.lastName, Validators.required),
      email: new FormControl(this.user.email)
    });
  }

  readURL(event: Event): void {
    this.isPhotoLoaded = true;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.photoUrl = reader.result as string;
        this.user.photo = {
          imageUrl: this.photoUrl,
          description: '',
          authorId: parseInt(localStorage.getItem('userId'), 10)
        };
      };
      reader.readAsDataURL(file);
    }
  }

  async saveUser() {
    if (!this.userForm.dirty && this.defaultImageUrl === this.photoUrl) {
      this.notifier.notify('error', 'Nothing to change');
      return;
    }

    this.defaultImageUrl = this.photoUrl;
    this.httpService
      .putData(`users`, this.user)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: User) => {
          this.testReceivedUser = data;
          this.notifier.notify('success', 'Changes Saved');
        },
        error => this.notifier.notify('error', 'Error saving')
      );
    if (this.isPhotoLoaded) {
      this.sharedService.avatar = { imageUrl: this.photoUrl };
    }
    localStorage.setItem('firstName', `${this.user.firstName}`);
    localStorage.setItem('lastName', `${this.user.lastName}`);
    localStorage.setItem('photoUrl', `${this.user.photoUrl}`);
    localStorage.setItem('email', this.user.email);
    this.userService.updateCurrentUser({ photoURL: this.photoUrl });
    this.isSaved = true;
  }

  closeNotification() {
    this.isSaved = false;
  }

  goBack() {
    window.history.back();
  }

  removeProfilePhoto() {
    this.photoUrl = null;
    this.user.photo = null;
    this.sharedService.avatar = { imageUrl: 'deleted' };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
