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
  photos_base64: string[] = [];

  constructor(private fileService: FileService) { }

  ngOnInit() {
  }
  saveChanges() {
    this.fileService.sendPhoto(this.photos_base64);
    
  }

  async onFileSelected(event) {
    if (event.target.files.length > 0) {
      let photos = event.target.files;
      this.photos_base64 = []
      for (let i=0; i<photos.length; i++) {
         this.photos_base64.push(await this.toBase64(photos[i]))
      };
    }
  }
  async onFileDropped(files) {
      this.photos_base64 = []
      for (let i=0; i<files.length; i++) {
        this.photos_base64.push(await this.toBase64(files[i]))
     };
  }

  public toBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
    

  toggleModal() {
    this.isActive = !this.isActive; 
  }

}
