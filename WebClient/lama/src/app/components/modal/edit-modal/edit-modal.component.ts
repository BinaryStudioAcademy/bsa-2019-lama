import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UpdatePhotoDTO, ImageEditedArgs, MenuItem } from 'src/app/models';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.sass']
})
export class EditModalComponent implements OnInit {
  
  @Input()
  public photo: PhotoRaw;
  clickedTabsItem: string = null;
  
  @Output() onDone = new EventEmitter<ImageEditedArgs>();
  
  save(editedImage: ImageEditedArgs) {
    this.onDone.emit(editedImage);
  }
  
  constructor() { }

  ngOnInit() {
	  
  }
  
  displayCrop() {
	this.clickedTabsItem = "crop";
  }
  
  displayRotate() {
	this.clickedTabsItem = "rotate";
  }

  closeModal() {
    
  }
}
