import { Directive, Input, OnChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMemeColor]'
})
export class MemeColorDirective implements OnChanges {
  @Input('appMemeColor') color: string;
  constructor(private elem: ElementRef) { }

  ngOnChanges() {
    this.elem.nativeElement.style.color = this.color ? this.color : 'black';
  }

}
