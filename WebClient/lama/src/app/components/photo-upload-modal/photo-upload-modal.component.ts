import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {

  isActive: boolean;
  image: File;
  photoUrl: string | ArrayBuffer;

  constructor(private fileService: FileService) 
    {

    }

  ngOnInit() {
    this.photoUrl = "https://www.passiton.com/assets/your_photo_here-bd52bd115083f7b7844b90b3af7395c4.png";
  }

  saveChanges() {
    let formData = new FormData();
    formData.append(this.image.name, this.image as Blob);
    let object = {};
    formData.forEach((value, key) => {object[key] = value});
    let json = JSON.stringify(object);
    this.fileService.sendPhoto(json).subscribe((e) => {console.log(e)});
    // this.fileService.sendPhoto().subscribe((e) => {console.log(e)});
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      let photo = event.target.files[0];
      this.image = photo;
      const reader = new FileReader();
      reader.addEventListener('load', () => (this.photoUrl = reader.result as string));
      reader.readAsDataURL(photo);
    }
  }
  onFileDropped(event) {
    let photo = event[0];
    this.image = photo;
    const reader = new FileReader();
    reader.addEventListener('load', () => (this.photoUrl = reader.result as string));
    reader.readAsDataURL(photo);
  }

  toggleModal() {
    this.isActive = !this.isActive; 
  }

}
