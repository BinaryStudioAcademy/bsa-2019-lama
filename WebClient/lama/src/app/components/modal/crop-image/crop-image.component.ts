import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { FileService } from 'src/app/services';

import { ImageCroppedArgs } from 'src/app/models';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.sass']
})
export class CropImageComponent implements OnInit
{
  // fields
  private imageUrl: string;
  private imageToCropBase64: string;
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
  public saveClickedEvent = new EventEmitter<ImageCroppedArgs>();
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

    this.saveClickedEvent.emit({
      originalImageUrl: this.imageUrl,
      croppedImageBase64: event.base64
    });
  }
  public cancelClickHandler(): void
  {
    this.cancelClickedEvent.emit();
  }

}
