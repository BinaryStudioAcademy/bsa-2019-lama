import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import { style, state, animate, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-carousele-component',
  templateUrl: './carousele-component.component.html',
  styleUrls: ['./carousele-component.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarouseleComponentComponent implements OnInit {
  @Input() photoId: number;
  items: PhotoRaw[] = [];
  imageUrls: string[] = [];
  style = false;
  @Input() isEnabled: boolean;
  finished = false;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getSimilarPhotos(this.photoId).subscribe(images => {
      images.forEach(element => {
        this.fileService.getPhoto(element.blob256Id).subscribe(url => {
          this.imageUrls.push(url);
          this.finished = true;
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
