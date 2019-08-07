import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { ImageService } from 'src/app/services';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.sass']
})
export class CropImageComponent implements OnInit
{
  // fields
  private imageToCropBase64: string;
  private imageService: ImageService;

  // properties
  @Input()
  public set imageToCrop(imageToCropUrl: string)
  {
    this.imageService.getImageBase64(imageToCropUrl)
      .then((res) => this.imageToCropBase64 = res);
  }

  @ViewChild('cropper', { static: false, read: ImageCropperComponent })
  public imageCropper: ImageCropperComponent;

  public cropperMinWidth: number;
  public cropperMinHeight: number;

  // events
  @Output()
  public saveClickedEvent = new EventEmitter<ImageCroppedEvent>();
  @Output()
  public cancelClickedEvent = new EventEmitter();

  // constructors
  constructor(imageService: ImageService)
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

    this.saveClickedEvent.emit(event);
  }
  public cancelClickHandler(): void
  {
    this.cancelClickedEvent.emit();
  }

}
