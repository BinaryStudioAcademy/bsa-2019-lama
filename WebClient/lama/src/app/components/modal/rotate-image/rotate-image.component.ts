import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FileService } from 'src/app/services';


@Component({
  selector: 'app-rotate-image',
  templateUrl: './rotate-image.component.html',
  styleUrls: ['./rotate-image.component.sass']
})
export class RotateImageComponent implements OnInit {

  constructor(private _imageService: FileService, private el: ElementRef, private renderer: Renderer) {
   }

  private elem: HTMLElement;
  private imageToRotateBase64: string;
  private degree: number = 0;
  private cx: CanvasRenderingContext2D;
  private image = new Image();
  private width: number;
  private height: number;
  private flag: boolean = true;

  @ViewChild("canvas", {static: false}) canvas;

  @Input()
  public set imageToRotate(imageToRotateUrl: string)
  {
    this._imageService.getImageBase64("assets/ppp.jpg")
      .then((res) => this.imageToRotateBase64 = res);
  }

  @Output()
  public saveClickedEvent = new EventEmitter();
  @Output()
  public cancelClickedEvent = new EventEmitter();
  

  ngOnInit() {
    this.image.src="assets/ppp.jpg";
    this.image.onload = ()=> {
      this.elem = this.el.nativeElement.firstChild
    }
  }

CounterClockwiseHandler(){
  this.setBiggerAndSmaller();
  this.degree-=90;
  if(this.degree%180==0){
    this.setParams(this.renderer, this.width, this.height);
  }
  else
    this.setParams(this.renderer, this.height, this.width);
  //this.renderer.setElementStyle(this.elem, '-max-width', this.elem.offsetHeight+'px');
  
}

ClockwiseHandler(){
  this.setBiggerAndSmaller();
  this.degree+=90;
  if(this.degree%180==0){
    this.setParams(this.renderer, this.width, this.height);
  }
  else
    this.setParams(this.renderer, this.height, this.width);
}

setParams(renderer:Renderer, width: number, height: number){
  this.renderer.setElementStyle(this.elem, 'max-height', height+'px');
  this.renderer.setElementStyle(this.elem, 'max-width', width+'px');
  this.renderer.setElementStyle(this.elem.firstChild, 'max-height', height+'px');
  this.renderer.setElementStyle(this.elem.firstChild, 'max-width', width+'px');
}

setBiggerAndSmaller(){
  if(!this.flag)
  return;
  else {
    this.width = this.elem.offsetWidth;
    this.height = this.elem.offsetHeight;
    this.flag = false;
  }
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

  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();    
  
    img.onload = function() {
      var width = img.width,
          height = img.height,
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d");
  
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
  
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }
  
      ctx.drawImage(img, 0, 0);
  
      callback(canvas.toDataURL());
    };
  
    img.src = srcBase64;
  };

}
