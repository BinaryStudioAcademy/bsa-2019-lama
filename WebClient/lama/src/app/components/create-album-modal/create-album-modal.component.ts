import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {

  images = [];
  @Input()
  public isShown: boolean;
  constructor() {
    this.isShown = true;
   }

  ngOnInit() {
  }



  activeColor: string = '#00d1b2';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';

  handleDragEnter() {
      this.dragging = true;
  }

  handleDragLeave() {
      this.dragging = false;
  }

  handleDrop(e) {
      e.preventDefault();
      this.dragging = false;
      this.handleInputChange(e);
  }

  handleImageLoad() {
      this.imageLoaded = true;
  }

  handleInputChange(e) {

    if (e.target.files && e.target.files[0]) {

      let filesAmount = e.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              let reader = new FileReader();
              var pattern = /image-*/;

              if (e.target.files[i].type.match(pattern)) {
                this.loaded = false;
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsDataURL(e.target.files[i]);
            }

      }
  }
  }

  _handleReaderLoaded(e) {
      var reader = e.target;
      this.imageSrc = reader.result;
      this.images.push(this.imageSrc);
      this.loaded = true;
  }


  toggleModal()
  {
    this.isShown = false;
  }
}
