import { Component, OnInit, Input } from '@angular/core';

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

  ngOnInit() {
  }

  toggleModal(e)
  {
    this.IsShow = false;
  }
}
