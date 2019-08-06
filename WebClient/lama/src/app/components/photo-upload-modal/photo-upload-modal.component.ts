import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { read } from 'fs';

@Component({
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {

  isActive: boolean;
  photoUrl: string | ArrayBuffer;
  // @Output()
  // onClose = new EventEmitter();

  constructor() 
    {
      // this.isActive = true;
    }

  ngOnInit() {
    this.photoUrl = "https://www.passiton.com/assets/your_photo_here-bd52bd115083f7b7844b90b3af7395c4.png";
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      let photo = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => (this.photoUrl = reader.result as string));
      reader.readAsDataURL(photo);
    }
  }
  onFileDropped(event) {
    let photo = event[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => (this.photoUrl = reader.result as string));
    reader.readAsDataURL(photo);
  }

  toggleModal() {
    this.isActive = !this.isActive; 
  }

}
