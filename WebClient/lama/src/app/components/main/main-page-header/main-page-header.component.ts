
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, Output, EventEmitter } from '@angular/core';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { element } from 'protractor';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharedService } from 'src/app/services/shared.service';
import { Photo } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.sass']
})
export class MainPageHeaderComponent implements OnInit {


  @ViewChild('photoUploadModal', { static: true, read: ViewContainerRef }) 
  private entry: ViewContainerRef;
  private resolver: ComponentFactoryResolver;
  private avatarUrl;
  // constructors
  constructor(public auth: AuthService, private router: Router, resolver: ComponentFactoryResolver, private shared: SharedService, private http: HttpService) 
  {
    this.resolver = resolver;
    http.getData(`users/${localStorage.getItem('userId')}`).subscribe(u => {
      this.avatarUrl = u.photoUrl;
    });
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
    componentRef.instance.addToList.subscribe(data => {
      let photos = []
      data.forEach(element => {
        photos.push({blobId: element.imageUrl});
      }) 
      this.shared.photos = photos;

    });
    componentRef.instance.toggleModal();    
  }
}
