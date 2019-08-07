import { Component, OnInit, Input } from '@angular/core';

import { Photo } from 'src/app/models';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass']
})
export class PhotoModalComponent implements OnInit {
  @Input()
  public photo: Photo;
  public isShown: boolean;

  // constructors
  constructor() {
    this.isShown = true;
  }

  ngOnInit() {
  }

  // methods
  protected closeModal(): void {
    this.isShown = false;
  }
}
