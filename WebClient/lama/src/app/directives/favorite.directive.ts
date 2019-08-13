import { Directive, Input, ElementRef, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appFavorite]'
})
export class FavoriteDirective implements OnInit, OnChanges {

  @Input('appFavorite') favorite: boolean = false;
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
      this.elem.nativeElement.innerText = "star";
      this.elem.nativeElement.style.color = "yellow";
    } 
    else{
      this.elem.nativeElement.innerText = "star_border";
      this.elem.nativeElement.style.color = "white";
  }
  }
}
