import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';

import { Photo } from 'src/app/models';
import { PhotoModalComponent } from '../../photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../photo-upload-modal/photo-upload-modal.component';

@Component({
  selector: 'main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass']
})
export class MainPhotosContainerComponent implements OnInit {

  // properties
  // showUploadModal: boolean = false;
  @Input() photos: Photo[];
  
  // fields
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  // constructors
  constructor(resolver: ComponentFactoryResolver) 
  {
    this.resolver = resolver;
  }

  ngOnInit() {
    this.photos = [{
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K",
      author: "Barack Obama"},
      {imageUrl:"https://kindlepreneur.com/wp-content/uploads/2017/01/Amazon-Super-URL.png", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_jKaKL5-m9re2poDCzjwCbqK-U62pW-5LDOGsv1Klgv_mh6nrA", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
    ]
    
  }
  

  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef }) 
  private entry_: ViewContainerRef;

  public uploadFile(event) {
    this.entry_.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.entry_.createComponent(factory);
    console.log(event);
    componentRef.instance.onFileDropped(event)
    componentRef.instance.toggleModal();
  }


  // methods
  public photoClicked(eventArgs: Photo)
  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    
  }

  public addToList(photos) {
    photos.forEach(element => {
      this.photos.push({imageUrl: element, author: ""});
    });
  }
}
