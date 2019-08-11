import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Album } from 'src/app/models/Album/album';
import { CreateAlbumModalComponent } from '../../create-album-module/create-album-modal/create-album-modal.component';
import { Router, NavigationExtras } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';


@Component({
  selector: 'app-main-albums-container',
  templateUrl: './main-albums-container.component.html',
  styleUrls: ['./main-albums-container.component.sass']
})
export class MainAlbumsContainerComponent implements OnInit {

  @Input() albums: Album[];

  ngOnInit() {

    let tempphotos = [{
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K",
      author: "Barack Obama"},
      {imageUrl:"https://kindlepreneur.com/wp-content/uploads/2017/01/Amazon-Super-URL.png", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
      {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_jKaKL5-m9re2poDCzjwCbqK-U62pW-5LDOGsv1Klgv_mh6nrA", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
      {imageUrl:"https://picsum.photos/id/42/600/700", author: "Donald Trump"},
      {
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K",
        author: "Barack Obama"},
        {imageUrl:"https://kindlepreneur.com/wp-content/uploads/2017/01/Amazon-Super-URL.png", author: "Donald Trump"},
        {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
        {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K", author: "Donald Trump"},
        {imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_jKaKL5-m9re2poDCzjwCbqK-U62pW-5LDOGsv1Klgv_mh6nrA", author: "Donald Trump"},
        {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
        {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
        {imageUrl:"https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg", author: "Donald Trump"},
        {imageUrl:"https://picsum.photos/id/42/600/700", author: "Donald Trump"}
    ]

    this.albums =[{
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Refer",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Places",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    },
    {
      author:"Barack Obama",
      name : "Cars",
      imageUrl: "https://drop.ndtv.com/albums/AUTO/pininfarina-battista/640_640x480.jpg",
      photos: tempphotos
    }]
    this.GetAlbums();
  }


  @ViewChild('CreateAlbumnContainer', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  // constructors
  constructor(resolver: ComponentFactoryResolver, private router: Router, private albumService: AlbumService ) {
    this.resolver = resolver;
  }

  GetAlbums() {
   // this.albumService.getAlbums().subscribe(albums => this.albums = albums.body);
  }

  public CreateAlbum(event) {
     this.entry.clear();
     const factory = this.resolver.resolveComponentFactory(CreateAlbumModalComponent);
     const componentRef = this.entry.createComponent(factory);
    // created album
  }
  // methods
  public albumClicked(eventArgs: Album) {

    const navigationExtras: NavigationExtras = {
      state: {
        album: eventArgs
      }
    };
    this.router.navigate(['/main/album'], navigationExtras);
  }

}
