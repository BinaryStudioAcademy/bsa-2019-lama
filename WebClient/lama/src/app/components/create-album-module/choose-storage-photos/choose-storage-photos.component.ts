import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo, PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import { User } from 'src/app/models/User/user';

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

  constructor(private photoService: FileService) {
    this.IsShow = true;
   }

  @Input() photos: PhotoRaw[] = [];
  @Output() onChange = new EventEmitter<PhotoRaw>();

  ngOnInit() {
    const id = this.currentUser.id; // second parameter is radix (explicitly specifying numeric system )
    this.photoService.receiveUsersPhotos(id).subscribe( x => this.photos = x);
  }

  toggleModal() {
    this.IsShow = false;
  }

  clickPerformed(eventArgs: PhotoRaw) {
    this.onChange.emit(eventArgs);
  }
}
