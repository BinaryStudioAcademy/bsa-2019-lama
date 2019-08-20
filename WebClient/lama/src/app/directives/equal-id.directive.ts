import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appEqualId]'
})
export class EqualIdDirective implements OnInit {

  @Input() appEqualId: boolean = false;
  constructor(private elem: ElementRef) { }

  ngOnInit(){
    if(this.appEqualId)
      this.elem.nativeElement.style.color = "inherit";
    else 
      this.elem.nativeElement.style.color = "grey";
  }
}
