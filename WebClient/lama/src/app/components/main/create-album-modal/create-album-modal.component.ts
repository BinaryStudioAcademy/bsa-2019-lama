import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {

  @Input()
  public isShown: boolean;
  constructor() {
    this.isShown = true;
   }

  ngOnInit() {
  }

  protected closeModal(): void {
    this.isShown = false;
  }
}
