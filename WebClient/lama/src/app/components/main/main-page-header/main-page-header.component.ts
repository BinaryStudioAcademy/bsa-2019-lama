import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PhotoUploadModalComponent } from '../../photo-upload-modal/photo-upload-modal.component';
import { element } from 'protractor';

@Component({
  selector: 'main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.sass']
})
export class MainPageHeaderComponent implements OnInit {

  @ViewChild('photoUploadModal', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;
  // constructors

  constructor(resolver: ComponentFactoryResolver) 
  {
    this.resolver = resolver;
  }

  
  ngOnInit() {
  }

  public openModalClicked(event): void
  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.toggleModal();
    
  }




}
