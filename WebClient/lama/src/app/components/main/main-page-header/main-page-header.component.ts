import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PhotoUploadModalComponent } from '../../photo-upload-modal/photo-upload-modal.component';
import { element } from 'protractor';

@Component({
  selector: 'main-page-header',
  templateUrl: './main-page-header.component.html',
  styleUrls: ['./main-page-header.component.sass']
})
export class MainPageHeaderComponent implements OnInit {

  showModal: boolean = false;
  ngOnInit() {
  }

  openModal() {
    this.showModal = true;
  }



}
