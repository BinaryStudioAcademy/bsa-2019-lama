import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { FileService } from 'src/app/services/file.service';

import { ImageEditedArgs } from 'src/app/models';

import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.sass']
})
export class CropImageComponent implements OnInit
{
  // fields
  private imageUrl: string;
  public imageToCropBase64: string;
  private imageService: FileService;

  // properties
  @Input()
  public set imageToCrop(imageToCropUrl: string)
  {
    this.imageUrl = imageToCropUrl;

    this.imageService.getImageBase64(imageToCropUrl)
      .then((res) => this.imageToCropBase64 = res);
  }

  @ViewChild('cropper', { static: false, read: ImageCropperComponent })
  public imageCropper: ImageCropperComponent;

  public cropperMinWidth: number;
  public cropperMinHeight: number;

  // events
  @Output()
  public saveClickedEvent = new EventEmitter<ImageEditedArgs>();
  @Output()
  public cancelClickedEvent = new EventEmitter();

  // constructors
  constructor(imageService: FileService)
  {
    this.imageService = imageService;

    this.cropperMinHeight = environment.photoEditing.crop.cropMinHeight;
    this.cropperMinWidth = environment.photoEditing.crop.cropMinWidth;
  }
  ngOnInit(): void { }

  // methods
  public async saveClickHandler(): Promise<void>
  {
    const event: ImageCroppedEvent = await this.imageCropper.crop();
    let modified = event.base64;
    if (this.imageToCropBase64.indexOf("image/jpeg") != -1 || this.imageToCropBase64.indexOf("image/jpg") != -1 ) {
      let exifObj = load(this.imageToCropBase64);
      let d = dump(exifObj);
      let jpg = insert(d, event.base64);
      modified = jpg
      console.log(load(modified));
    }
    this.saveClickedEvent.emit({
      originalImageUrl: this.imageUrl,
      editedImageBase64: modified
    });
  }
  public cancelClickHandler(): void
  {
    this.cancelClickedEvent.emit();
  }

  

}
