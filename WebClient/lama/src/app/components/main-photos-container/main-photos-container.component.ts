import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass']
})
export class MainPhotosContainerComponent implements OnInit {

  constructor() { }
  @Input() photo_urls: string[];
  ngOnInit() {
    
  }

}
