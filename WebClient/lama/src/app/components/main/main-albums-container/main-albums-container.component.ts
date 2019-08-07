import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Albumn } from 'src/app/models/Album/album';
import { CreateAlbumModalComponent } from '../../create-album-module/create-album-modal/create-album-modal.component';


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


  @ViewChild('CreateAlbumnContainer', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  // constructors
  constructor(resolver: ComponentFactoryResolver) {
    this.resolver = resolver;
  }

  public CreateAlbum(event) {
     this.entry.clear();
     const factory = this.resolver.resolveComponentFactory(CreateAlbumModalComponent);
     const componentRef = this.entry.createComponent(factory);
    // created album
  }
  // methods
  public albumClicked(eventArgs: Albumn) {
    //const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    //const componentRef = this.entry.createComponent(factory);
    //componentRef.instance.photo = eventArgs;  
  }

}
