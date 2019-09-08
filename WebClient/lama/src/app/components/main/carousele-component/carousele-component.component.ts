import { Component, OnInit, Input } from '@angular/core';
import { PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';

@Component({
  selector: 'app-carousele-component',
  templateUrl: './carousele-component.component.html',
  styleUrls: ['./carousele-component.component.sass']
})
export class CarouseleComponentComponent implements OnInit {
  @Input() photoId: number;
  items: PhotoRaw[] = [];
  imageUrls: string[] = [];
  style = false;
  @Input() isEnabled: boolean;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getSimilarPhotos(this.photoId).subscribe(images => {
      images.forEach(element => {
        this.fileService.getPhoto(element.blob256Id).subscribe(url => {
          this.imageUrls.push(url);
        });
      });
    });
  }

  calculateWidth() {
    if (this.imageUrls.length <= 3) {
      return this.imageUrls.length * 120;
    } else {
      return 360;
    }
  }
}
