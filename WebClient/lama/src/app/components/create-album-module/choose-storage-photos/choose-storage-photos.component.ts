import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-choose-storage-photos',
  templateUrl: './choose-storage-photos.component.html',
  styleUrls: ['./choose-storage-photos.component.sass']
})
export class ChooseStoragePhotosComponent implements OnInit {

  @Input()
  public IsShow: boolean;
  
  constructor() {
    this.IsShow = true;
   }
   
  @Input() photos: Photo[];
  @Output() onChange = new EventEmitter<Photo>();

  ngOnInit() {
  }

  toggleModal(e)
  {
    this.IsShow = false;
  }
  public clickPerformed(eventArgs: Photo)
  {
    this.onChange.emit(eventArgs);
  }
}
