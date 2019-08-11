import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services';


@Component({
  selector: 'app-rotate-image',
  templateUrl: './rotate-image.component.html',
  styleUrls: ['./rotate-image.component.sass']
})
export class RotateImageComponent implements OnInit {

  constructor(private _imageService: FileService) { }

  private imageUrl: string;
  private imageToRotateBase64: string;
  private rotateDegree: number = 0;

  @Input()
  public set imageToRotate(imageToRotateUrl: string)
  {
    this.imageUrl = imageToRotateUrl;

    this._imageService.getImageBase64(imageToRotateUrl)
      .then((res) => this.imageToRotateBase64 = res);
  }

  @Output()
  public saveClickedEvent = new EventEmitter();
  @Output()
  public cancelClickedEvent = new EventEmitter();
  

  ngOnInit() {
  }

  public async saveClickHandler(): Promise<void>
  {
    //const event: ImageCroppedEvent = await this.imageCropper.crop();

    this.saveClickedEvent.emit();
  }

  public cancelClickHandler(): void
  {
    this.cancelClickedEvent.emit();
  }

}
