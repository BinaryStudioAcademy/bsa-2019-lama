import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { read } from 'fs';

@Component({
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {

  photoUrl: string | ArrayBuffer;
  
  @Output()
  onClose = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onFileSelected(event) {

    if (event.target.files.length > 0) {

      let photo = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => (this.photoUrl = reader.result as string));
      reader.readAsDataURL(photo);
    }
  }

  closeModal() {
    this.onClose.emit(null); 
  }

}
