import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appIsBlocked]'
})
export class IsBlockedDirective implements OnInit {
  @Input('appIsBlocked') blocked: boolean;

  constructor(private elem: ElementRef) { }

  ngOnInit() {
    if (this.blocked) {
      this.elem.nativeElement.parentElement.parentElement.style.display = 'none';
    } else {
      this.elem.nativeElement.parentElement.parentElement.style.display = 'block';
    }
  }

}
