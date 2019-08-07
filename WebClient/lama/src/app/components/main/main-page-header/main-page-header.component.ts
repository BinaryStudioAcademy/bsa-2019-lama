
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
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
  constructor(public auth: AuthService, private router: Router, resolver: ComponentFactoryResolver) 
  {
    this.resolver = resolver;
  }
  
  ngOnInit() {
  }

  public logOut() {
    this.auth.doLogout()
             .then(() => this.router.navigate(['/']))
             .catch(e => {console.log("user is not signed in")});
  }

  public openModalClicked(event): void
  {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.toggleModal();    
  }
}
