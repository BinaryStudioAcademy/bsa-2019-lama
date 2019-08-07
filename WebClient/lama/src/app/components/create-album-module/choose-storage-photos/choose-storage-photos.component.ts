import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-choose-storage-photos',
  templateUrl: './choose-storage-photos.component.html',
  styleUrls: ['./choose-storage-photos.component.sass']
})
export class ChooseStoragePhotosComponent implements OnInit {

  @Input()
  public IsShow: boolean;
  
  constructor() {
    this.IsShow = true;
   }
   
  @Input() photos: Photo[];
  @Output() onChange = new EventEmitter<Photo>();

  ngOnInit() {
    this.photos = [{
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K",
      author: "Barack Obama"},
      {imageUrl:"https://kindlepreneur.com/wp-content/uploads/2017/01/Amazon-Super-URL.png", author: "Donald Trump"},
      {imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_jKaKL5-m9re2poDCzjwCbqK-U62pW-5LDOGsv1Klgv_mh6nrA', author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_jKaKL5-m9re2poDCzjwCbqK-U62pW-5LDOGsv1Klgv_mh6nrA', author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"}
    ]
  }

  toggleModal(e)
  {
    this.IsShow = false;
  }
  public clickPerformed(eventArgs: Photo)
  {
    this.onChange.emit(eventArgs);
  }
}
