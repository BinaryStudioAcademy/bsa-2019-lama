import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.sass']
})
export class ShareModalComponent implements OnInit {
  
  @Input()
  receivedPhoto: PhotoRaw;
  public photo: PhotoRaw;
  public showSharedByLinkModal: boolean = false;
  public showSharedByEmailModal: boolean = false;

  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openShareByLink() {
    this.showSharedByLinkModal = true;
  }

  openShareByEmail() {
    this.showSharedByEmailModal = true;
  }

  public cancel(){
    this.onClose.emit(null);
  }
}
