import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appIsBlocked]'
})
export class IsBlockedDirective implements OnChanges {
  @Input('appIsBlocked') blocked: boolean;

  constructor(private elem: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    const elem = this.elem.nativeElement.parentElement.parentElement;
    if (this.blocked) {
      this.renderer.setAttribute(elem, 'style', 'display: none!important');
    } else {
      elem.style.display = 'block';
    }
  }
}
