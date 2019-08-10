import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import imageCompression from 'browser-image-compression';
import { Photo } from 'src/app/models';
import { environment } from '../../../../environments/environment';
import { Album } from 'src/app/models/Album/album';
@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {

  photos: Photo[] = [];
  album: Album;
  albumName: string;
  activeColor: string = '#00d1b2';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  dragging: boolean = false;
  loaded: boolean = true;
  imageSrc: string = '';

  @Input()
  public isShown: boolean;

  constructor(resolver: ComponentFactoryResolver) {
    this.isShown = true;
    this.resolver = resolver;
   }

  ngOnInit() {

  }



  handleDragEnter() {
      this.dragging = true;
  }

  handleDragLeave() {
    alert(2);
      this.dragging = false;
  }

  handleDrop(e) {
      const files = e.dataTransfer.files;
      e.preventDefault();
      this.dragging = false;
      this.LoadFile(files);
  }


  handleInputChange(e) {
    let files = e.target.files;
    this.LoadFile(files);
  }

  async LoadFile(files)
  {
    if (files && files[0]) {
      let filesAmount = files.length;
      for (let i = 0; i < filesAmount; i++) {
              this.loaded = false;
              let reader = new FileReader();
              var pattern = /image-*/;

              if (files[i].type.match(pattern)) {
                const compressFile = await imageCompression(files[i], environment.compressionOptions);
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsDataURL(compressFile);
            }
      }
  }
  this.loaded = true;
  }


  _handleReaderLoaded(e) {
      var reader = e.target;
      this.imageSrc = reader.result;
      this.photos.push({imageUrl: this.imageSrc});
  }

  CreateAlbum()
  {
    this.isShown = false;
  }
  toggleModal()
  {
    this.isShown = false;
  }

  ChoosePhoto(e)
  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChooseStoragePhotosComponent);
    const componentRef = this.entry.createComponent(factory);
    let instance = componentRef.instance as ChooseStoragePhotosComponent;
    instance.onChange.subscribe((e)=>this.onChange(e));
  }
  public onChange(eventArgs: Photo)
  {
    if(this.photos.filter(x => x.imageUrl === eventArgs.imageUrl)[0] === undefined)
    {
      this.photos.push({imageUrl:eventArgs.imageUrl});
    }
    else{
      this.photos = this.photos.filter(x => x.imageUrl !== eventArgs.imageUrl);
    }
  }
  
  @ViewChild('ChoosePhotos', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

}
