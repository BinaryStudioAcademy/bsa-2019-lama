
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { element } from 'protractor';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { SharedService } from 'src/app/services/shared.service';
import { Photo } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';
import { FileService } from 'src/app/services';


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
  private searchCriteria: string = "";
  private isActive: boolean  = false;

  // constructors
  constructor(public auth: AuthService, private router: Router,
     resolver: ComponentFactoryResolver, private shared: SharedService,
      private http: HttpService, private file: FileService) 
  {
    this.resolver = resolver;
  }
  

  ngOnInit() {
    let id = localStorage.getItem('userId')
    if (id != null || id != "") {
      this.http.getData(`users/${localStorage.getItem('userId')}`).subscribe(u => {
        this.avatarUrl = u.photoUrl;
      })
    }
  }

  ngDoCheck() {
    if (this.shared.avatar != null)
      this.avatarUrl = this.shared.avatar.imageUrl;

    (this.searchCriteria.length < 3) ? this.isActive = false : this.isActive = true; 

    if (!this.isActive)
      this.restore();
  }

  public logOut() {
    this.auth.doLogout()
            .then(this.auth.token = null)
            .then(() => this.router.navigate(['/']))
            .catch(e => {console.log("user is not signed in")});
  }

  public find() {
    this.http.findPhotos(this.searchCriteria).subscribe(p => {
      this.shared.foundedPhotos = p; 
    })
  }

  public restore() {
    this.file.receivePhoto().subscribe(p => {
      this.shared.foundedPhotos = p;
    })
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
