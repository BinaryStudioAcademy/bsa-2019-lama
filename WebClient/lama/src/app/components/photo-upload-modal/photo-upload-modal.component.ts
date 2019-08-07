import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';
import { MainPhotosContainerComponent } from '../main/main-photos-container/main-photos-container.component';
import { Photo } from 'src/app/models';

@Component({
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {

  isActive: boolean;
  photos: Photo[] = [];
  desc: string[] = [];

  @Output() outputEvent : EventEmitter<Photo[]> = new EventEmitter<Photo[]>(); 

  constructor(private fileService: FileService) { }

  ngOnInit() {
  }
  saveChanges() {
    for (let i=0; i<this.photos.length; i++) {
      this.photos[i] = {imageUrl: this.photos[i].imageUrl, description: this.desc[i]}
    }
    this.outputEvent.emit(this.photos);
    this.fileService.sendPhoto(this.photos);
    this.toggleModal();
  }

  async onFileSelected(event) {
    if (event.target.files.length > 0) {
      let files = event.target.files;
      this.photos = []
      for (let i=0; i<files.length; i++) {
         this.photos.push({imageUrl: await this.toBase64(files[i])})
      };
    }
  }
  async onFileDropped(files) {
      this.photos = []
      for (let i=0; i<files.length; i++) {
        this.photos.push({imageUrl: await this.toBase64(files[i])})
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
