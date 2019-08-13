import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, AfterViewInit, OnChanges, DoCheck, EventEmitter, Output } from '@angular/core';

import { Photo } from 'src/app/models';
import { PhotoModalComponent } from '../../modal/photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from '../../modal/photo-upload-modal/photo-upload-modal.component';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services/file.service';
import { SharedService } from 'src/app/services/shared.service';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/models/User/user';

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
  isNothingFounded: boolean;
  isSearchTriggered: boolean;
  currentUser : User;

  // fields
  private resolver: ComponentFactoryResolver;

  @ViewChild('modalPhotoContainer', { static: true, read: ViewContainerRef })
  private modalPhotoEntry: ViewContainerRef;

  @ViewChild('modalUploadPhoto', { static: true, read: ViewContainerRef })
  private modalUploadPhotoEntry: ViewContainerRef;

  // constructors
  constructor(resolver: ComponentFactoryResolver, private service: FileService, private _e: ElementRef, private shared: SharedService,
    private httpService: HttpService)
  {
    this.resolver = resolver;
  }
  ngOnInit(){

    this.httpService.getData(`users/${localStorage.getItem('userId')}`)
    .subscribe((user) =>
    {
      //this.currentUser = user;
      this.GetPhotos();
    });
  }

  public GetPhotos() {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false
      this.showSpinner = true
      this.photos = []
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
      this.showSpinner = false;
    });
  }

  public GetUserPhotos(UserId: number) {
    this.isNothingFounded = false;
    this.shared.isSearchTriggeredAtLeastOnce = false
      this.showSpinner = true
      this.photos = []
    this.service.receivePhoto().subscribe(info => {
      this.photos = info as PhotoRaw[];
      this.showSpinner = false;
    });
  }

  ngDoCheck() {
    if (this.shared.photos) {
      this.shared.photos.forEach(element => {
        this.photos.push(element);
      });
    }
    if (this.shared.foundedPhotos.length != 0 && this.shared.isSearchTriggered) {
      this.photos = this.shared.foundedPhotos;
      this.isNothingFounded = false;
    }
    if (this.shared.foundedPhotos.length == 0 && this.shared.isSearchTriggered) {
      this.photos = [];
      this.isNothingFounded = true;
    }
    this.isSearchTriggered = this.shared.isSearchTriggeredAtLeastOnce;
    this.shared.isSearchTriggered = false;
    this.shared.foundedPhotos = []
    this.shared.photos = []
  }


  // methods
  public uploadFile(event)
  {
    this.modalUploadPhotoEntry.clear();
    const factory = this.resolver.resolveComponentFactory(PhotoUploadModalComponent);
    const componentRef = this.modalUploadPhotoEntry.createComponent(factory);

    componentRef.instance.onFileDropped(event);
    componentRef.instance.addToListEvent.subscribe(this.uploadPhotoHandler.bind(this));
    componentRef.instance.toggleModal();
  }
  public uploadPhotoHandler(uploadedPhotos: UploadPhotoResultDTO[]): void
  {
      this.photos.push(...uploadedPhotos);
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
