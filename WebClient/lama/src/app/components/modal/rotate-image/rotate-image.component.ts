import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { FileService } from 'src/app/services';
import { ImageEditedArgs } from 'src/app/models/Photo/ImageEditedArgs';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';


@Component({
  selector: 'app-rotate-image',
  templateUrl: './rotate-image.component.html',
  styleUrls: ['./rotate-image.component.sass']
})
export class RotateImageComponent implements OnInit {

  constructor(private _imageService: FileService, private el: ElementRef, private renderer: Renderer) {
   }

  private imageToRotateBase64: string;
  private imageUrl: string;

  @Input()
  public set imageToRotate(imageToRotateUrl: string)
  {
    this.imageUrl = imageToRotateUrl;
    this._imageService.getImageBase64(imageToRotateUrl)
      .then((res) => this.imageToRotateBase64 = res);
  }

  @Output()
  public saveClickedEvent = new EventEmitter<ImageEditedArgs>();
  @Output()
  public cancelClickedEvent = new EventEmitter();
  

  ngOnInit() {
  }

  rotateBase64Image90deg(base64Image, isClockwise) {
    let d;
    if (base64Image.indexOf("image/jpeg") != -1 || base64Image.indexOf("image/jpeg") != -1 ) {
      let exifObj = load(base64Image);
      d = dump(exifObj)
    }
    var offScreenCanvas = document.createElement('canvas');
    var offScreenCanvasCtx = offScreenCanvas.getContext('2d');

    var img = new Image();
    img.src = base64Image;

    offScreenCanvas.height = img.width;
    offScreenCanvas.width = img.height;

    if (isClockwise) { 
        offScreenCanvasCtx.rotate(90 * Math.PI / 180);
        offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
    } else {
        offScreenCanvasCtx.rotate(-90 * Math.PI / 180);
        offScreenCanvasCtx.translate(-offScreenCanvas.height, 0);
    }
    offScreenCanvasCtx.drawImage(img, 0, 0);
    let base64Result = offScreenCanvas.toDataURL("image/jpeg", 100);
    if (base64Image.indexOf("image/jpeg") != -1 || base64Image.indexOf("image/jpeg") != -1 ) {
      return insert(d, base64Result)
    }
    return base64Result;
}

CounterClockwiseHandler(){
  this.imageToRotateBase64 = this.rotateBase64Image90deg(this.imageToRotateBase64, false);
}

ClockwiseHandler(){
  this.imageToRotateBase64 = this.rotateBase64Image90deg(this.imageToRotateBase64, true);
}

  public async saveClickHandler(): Promise<void>
  {
    this.saveClickedEvent.emit({
      originalImageUrl: this.imageUrl,
      editedImageBase64: this.imageToRotateBase64
    });
  }

  public cancelClickHandler(): void
  {
    this.cancelClickedEvent.emit();
  }

}
