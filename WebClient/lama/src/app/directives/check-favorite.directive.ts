import { Directive, Input, ElementRef, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appCheckFavorite]'
})
export class CheckFavoriteDirective implements OnInit, OnChanges {

  @Input('appCheckFavorite') favorite: boolean = false;
  constructor(private elem: ElementRef) {
  }
  ngOnInit(){
    this.setStyle();
  }

  ngOnChanges(){
    this.setStyle();
  }

  setStyle(){
    if(this.favorite){
      this.elem.nativeElement.style.visibility = "visible";
    } 
    else{
      this.elem.nativeElement.style.visibility = "hidden";
    }
  }

}
