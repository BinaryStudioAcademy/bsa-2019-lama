import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnChanges, DoCheck, EventEmitter, Output } from '@angular/core';

import { Photo } from 'src/app/models';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services/file.service';
import { SharedService } from 'src/app/services/shared.service';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';

@Component({
  selector: 'main-photos-container',
  templateUrl: './main-photos-container.component.html',
  styleUrls: ['./main-photos-container.component.sass']
})
export class MainPhotosContainerComponent implements OnInit {

  // properties
  // showUploadModal: boolean = false;
  @Input() photos: PhotoRaw[] = [];
  showSpinner = true;

  // fields
  private resolver: ComponentFactoryResolver;

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef })
  private modalUploadPhotoEntry: ViewContainerRef;

  // constructors
  constructor(resolver: ComponentFactoryResolver, private service: FileService, private _e: ElementRef, private shared: SharedService)
  {
    this.resolver = resolver;
  }
  ngOnInit()
  {
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
      this.showSpinner = false;
    });
  }

  ngDoCheck() 
  {
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.push(element);
      });
    }
    this.shared.photos = []
  }


  // methods
  public uploadFile(event)
  {
    this.modalUploadPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.modalUploadPhotoEntry.createComponent(factory);

    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToListEvent.subscribe(uploadedPhotos => 
    {
      this.photos.push(...uploadedPhotos);
      console.log(this.photos);
    });
    componentRef.instance.toggleModal();
  }

  public photoClicked(eventArgs: PhotoRaw)
  {
    this.modalPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoModalComponent);
    const componentRef = this.modalPhotoEntry.createComponent(factory);
    componentRef.instance.photo = eventArgs;
    componentRef.instance.deletePhotoEvenet.subscribe(this.deletePhotoHandler.bind(this));
  }
  
  public deletePhotoHandler(photoToDeleteId: number): void
  {
    this.photos = this.photos.filter(p => p.id !== photoToDeleteId);
  }

}
