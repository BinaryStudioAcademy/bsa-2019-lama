import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';
import { MainPhotosContainerComponent } from '../../main/main-photos-container/main-photos-container.component';
import { Photo } from 'src/app/models';
import { Subject } from 'rxjs';
import imageCompression from 'browser-image-compression';
import { environment } from '../../../../environments/environment';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';

@Component({
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {

  isActive: boolean;
  photos: Photo[] = [];
  desc: string[] = []; 
  showSpinner: boolean = false;

  @Output()
  addToListEvent: EventEmitter<UploadPhotoResultDTO[]> = new EventEmitter<UploadPhotoResultDTO[]>();

  constructor(private fileService: FileService) { }

  ngOnInit() {
  }

  saveChanges() {
    let userId = localStorage.getItem('userId');
    for (let i = 0; i < this.photos.length; i++) 
    {
      this.photos[i] = { imageUrl: this.photos[i].imageUrl, description: this.desc[i], authorId: parseInt(userId), filename: this.photos[i].filename }
    }
    this.fileService.sendPhoto(this.photos)
    .subscribe(uploadedPhotos => 
      {
        this.addToListEvent.emit(uploadedPhotos);
        this.toggleModal();
      });
  }

  async onFileSelected(event) {
    if (event.target.files.length > 0) {
      let files = event.target.files;
      await this.onFileDropped(files);
    }
  }
  async onFileDropped(files: File[]) {
      this.showSpinner = true;
      this.photos = []
      for (let i=0; i<files.length; i++) 
      {
        if (files[i].type == "image/jpeg" || files[i].type == "image/jpg") {
          let exifObj = load(await this.toBase64(files[i]));
          let d = dump(exifObj);
          let compressedFile = await imageCompression(files[i], environment.compressionOptions);
          let base64 = await this.toBase64(compressedFile);
          remove(base64);
          let modifiedObject = insert(d, base64);
          this.showSpinner = false;
          this.photos.push({imageUrl: modifiedObject, filename: files[i].name})
        }
        else {
          let compressedFile = await imageCompression(files[i], environment.compressionOptions);
          this.showSpinner = false;
          this.photos.push({imageUrl: await this.toBase64(compressedFile), filename: files[i].name})
        }
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
