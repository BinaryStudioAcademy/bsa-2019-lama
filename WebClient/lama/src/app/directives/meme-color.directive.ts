import { Directive, Input, OnChanges, ElementRef } from '@angular/core';
import { invertColor } from 'src/app/export-functions/meme';

@Directive({
  selector: '[appMemeColor]'
})
export class MemeColorDirective implements OnChanges {
  @Input('appMemeColor') color: string;
  constructor(private elem: ElementRef) { }

  ngOnChanges() {
    this.elem.nativeElement.style.webkitTextStroke = `1px ${invertColor(this.color)}`;
    this.elem.nativeElement.style.color = this.color;
  }

}
