import { Component, Input, EventEmitter, Output, ViewChild, OnChanges, DoCheck, ElementRef } from '@angular/core';
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
  isMemeMode: boolean;
  upText: string;
  memeSaved: boolean;
  downText: string;
  colorPicker: string;
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
  public resetClickedEvent = new EventEmitter();
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
    if (this.isMemeMode) {
      this.imageToEditBase64 = this.createMem(this.imageToEditBase64);
    }
    const event: ImageCroppedEvent = await this.imageEditor.crop();
    this.saveClickedEvent.emit({
      originalImageUrl: this.imageToEditBlobId,
      editedImageBase64: this.imageService.copyExif(this.imageToEditBase64, event.base64)
    });
  }
  public cancelClickHandler() {
    this.cancelClickedEvent.emit();
  }

  createMem(base64Image: string) {
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCanvasCtx = offScreenCanvas.getContext('2d');

    const img = new Image();
    img.src = base64Image;

    offScreenCanvas.height = img.height;
    offScreenCanvas.width = img.width;
    offScreenCanvasCtx.textAlign = 'center';
    offScreenCanvasCtx.drawImage(img, 0, 0);
    const fontSize = this.getFontSize(img.width);
    offScreenCanvasCtx.font = `bold ${fontSize}px Segoi`;
    offScreenCanvasCtx.fillStyle = this.colorPicker;
    this.writeText(offScreenCanvasCtx, this.upText, img.width / 2, img.height / 8, fontSize);
    const bottomHeight = img.height - (2 * fontSize);
    this.writeText(offScreenCanvasCtx, this.downText, img.width / 2, bottomHeight, fontSize);

    this.upText = this.downText = '';
    this.memeSaved = true;
    return offScreenCanvas.toDataURL('image/jpeg', 100);
}

resetClickHandler() {
  this.resetClickedEvent.emit();
}

findMiddleBySpace(text: string) {
  let middle = Math.floor(text.length / 2);
  const before = text.lastIndexOf(' ', middle);
  const after = text.indexOf(' ', middle + 1);
  if (middle - before < after - middle) {
      middle = before;
  } else {
      middle = after;
  }
  return middle;
}

writeInTwoColumns(canvas: CanvasRenderingContext2D, text: string, centerPoint: number, height: number, fontSize: number) {
  const middle = this.findMiddleBySpace(text);
  const str1 = text.substr(0, middle);
  const str2 = text.substr(middle + 1);
  canvas.fillText(str1.toUpperCase(), centerPoint, height);
  canvas.fillText(str2.toUpperCase(), centerPoint, height + fontSize + 10);
}

writeText(canvas: CanvasRenderingContext2D, text: string, centerPoint: number, height: number, fontSize: number) {
  if (!text) {
    return;
  }
  if (text.length > 25) {
    this.writeInTwoColumns(canvas, text, centerPoint, height, fontSize );
  } else {
    canvas.fillText(text.toUpperCase(), centerPoint, height);
  }
}

getFontSize(width: number) {
  return width / 25 ;
}

  enableMeme() {
    this.isMemeMode = true;
  }

  disableMeme() {
    this.isMemeMode = false;
  }

}
