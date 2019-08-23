import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo, PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import { User } from 'src/app/models/User/user';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-choose-storage-photos',
  templateUrl: './choose-storage-photos.component.html',
  styleUrls: ['./choose-storage-photos.component.sass']
})
export class ChooseStoragePhotosComponent implements OnInit {
  @Input()
  public IsShow: boolean;

  @Output()
  currentUser: User;

  constructor(
    private photoService: FileService,
    private notifier: NotifierService
  ) {
    this.IsShow = true;
  }

  @Input() photos: PhotoRaw[] = [];
  @Output() Change = new EventEmitter<PhotoRaw>();

  ngOnInit() {
    const id = this.currentUser.id;
    this.photoService
      .receiveUsersPhotos(id)
      .subscribe(
        x => (this.photos = x),
        error => this.notifier.notify('error', 'Error downloading')
      );
  }

  toggleModal() {
    this.IsShow = false;
  }

  clickPerformed(eventArgs: PhotoRaw) {
    this.Change.emit(eventArgs);
  }
}
