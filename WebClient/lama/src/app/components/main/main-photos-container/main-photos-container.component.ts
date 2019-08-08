import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnChanges, DoCheck, EventEmitter, Output } from '@angular/core';

import { Photo } from 'src/app/models';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services/file.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass']
})
export class MainPhotosContainerComponent implements OnInit {

  // properties
  // showUploadModal: boolean = false;
  @Input() photos: PhotoRaw[] = [];
  
  // fields
  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  // constructors
  constructor(resolver: ComponentFactoryResolver, private service: FileService, private _e: ElementRef, private shared: SharedService)
  {
    this.resolver = resolver;
  }
  ngOnInit(){ 
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
    });
  }

  ngDoCheck() {
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.push(element);
      });
    }
    this.shared.photos = []
  }

  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef }) 
  private entry_: ViewContainerRef;

  public uploadFile(event) {
    this.entry_.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.entry_.createComponent(factory);
    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToList.subscribe(data => {
      data.forEach(element => {
        this.photos.push({blobId: element.imageUrl});
      }) 
    });
    componentRef.instance.toggleModal();
  }


  // methods
  public photoClicked(eventArgs: PhotoRaw)
  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
  }
  
}
