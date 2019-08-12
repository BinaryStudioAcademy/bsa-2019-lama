import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef, ViewChild, ComponentRef } from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';
import { MainPhotosContainerComponent } from '../../main/main-photos-container/main-photos-container.component';
import { Photo } from 'src/app/models';
import { Subject } from 'rxjs';
import imageCompression from 'browser-image-compression';
import { environment } from '../../../../environments/environment';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';

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
        // let compressedFile;
        // this._ngxPicaService.compressImage(files[i], environment.compressionOptions.maxSizeMB).subscribe(img => {
        //   compressedFile = img;
        //   this.showSpinner = false;
        //   this.toBase64(compressedFile).then(f => {
        //     this.photos.push({imageUrl: f})
        //   })
        // });
        // let compressedFile = await imageCompression(files[i], environment.compressionOptions);
        this.showSpinner = false;
        this.photos.push({imageUrl: await this.toBase64(files[i]), filename: files[i].name})
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
