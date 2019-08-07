import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ChooseStoragePhotosComponent } from '../choose-storage-photos/choose-storage-photos.component';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {

  images = [];


  @Input()
  public isShown: boolean;

  constructor(resolver: ComponentFactoryResolver) {
    this.isShown = true;
    this.resolver = resolver;
   }

  ngOnInit() {
  }

  activeColor: string = '#00d1b2';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';

  handleDragEnter() {
      this.dragging = true;
  }

  handleDragLeave() {
      this.dragging = false;
  }

  handleDrop(e) {
      e.preventDefault();
      this.dragging = false;
      this.handleInputChange(e);
  }

  handleImageLoad() {
      this.imageLoaded = true;
  }

  handleInputChange(e) {

    if (e.target.files && e.target.files[0]) {

      let filesAmount = e.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              let reader = new FileReader();
              var pattern = /image-*/;

              if (e.target.files[i].type.match(pattern)) {
                this.loaded = false;
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsDataURL(e.target.files[i]);
            }

      }
  }
  }

  _handleReaderLoaded(e) {
      var reader = e.target;
      this.imageSrc = reader.result;
      this.images.push(this.imageSrc);
      this.loaded = true;
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
    if(this.images.filter(x => x === eventArgs.imageUrl)[0] === undefined)
    {
      this.images.push(eventArgs.imageUrl);
    }
    else{
      this.images = this.images.filter(x => x !== eventArgs.imageUrl);
    }
  }
  
  @ViewChild('ChoosePhotos', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

}
