import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Albumn } from 'src/app/models/Album/album';


@Component({
  selector: 'app-main-albums-container',
  templateUrl: './main-albums-container.component.html',
  styleUrls: ['./main-albums-container.component.sass']
})
export class MainAlbumsContainerComponent implements OnInit {

  @Input() albums: Albumn[];

  ngOnInit() {
    this.albums =[{
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg"
    }]
  }


  // constructors
  constructor() {
  }

  public CreateAlbum(event) {


    // created album
  }
  // methods
  public albumClicked(eventArgs: Albumn) {
    //const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    //const componentRef = this.entry.createComponent(factory);
    //componentRef.instance.photo = eventArgs;  
  }

}
