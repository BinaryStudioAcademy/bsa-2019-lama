import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ImageEditedArgs } from 'src/app/models';
import { FileService } from 'src/app/services';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.sass']
})
export class EditPhotoComponent {
  // fields
  private imageUrl: string;
  imageToEditBase64: string;
  @Input()
  imageToEditBlobId: string;
  private imageService: FileService;

  // properties
  @Input()
  public set imageToEdit(imageToCropUrl: string) {
    this.imageUrl = imageToCropUrl;

    this.imageService.getImageBase64(imageToCropUrl)
      .then((res) => this.imageToEditBase64 = res);
  }

  @ViewChild('editor', { static: false, read: ImageCropperComponent })
  public imageEditor: ImageCropperComponent;

  public cropperMinWidth: number;
  public cropperMinHeight: number;

  public croppedImageWidth: number;
  public croppedImageHeight: number;

  // events
  @Output()
  public saveClickedEvent = new EventEmitter<ImageEditedArgs>();
  @Output()
  public cancelClickedEvent = new EventEmitter();

  // constructors
  constructor(imageService: FileService) {
    this.imageService = imageService;
    this.cropperMinHeight = environment.photoEditing.crop.cropMinHeight;
    this.cropperMinWidth = environment.photoEditing.crop.cropMinWidth;
  }

  // methods
  public rotateLeftHandler() {
    this.imageEditor.rotateLeft();
  }

  public rotateRightHandler() {
    this.imageEditor.rotateRight();
  }

  public flipHorizontalHandler() {
    this.imageEditor.flipHorizontal();
  }
  public flipVerticalHandler() {
    this.imageEditor.flipVertical();
  }

  public imageCroppedHandler(event: ImageCroppedEvent) {
    this.croppedImageHeight = event.height;
    this.croppedImageWidth = event.width;
  }
  public async saveClickHandler(): Promise<void> {
    const event: ImageCroppedEvent = await this.imageEditor.crop();
    this.saveClickedEvent.emit({
      originalImageUrl: this.imageToEditBlobId,
      editedImageBase64: this.imageService.copyExif(this.imageToEditBase64, event.base64)
    });
  }
  public cancelClickHandler() {
    this.cancelClickedEvent.emit();
  }

}
