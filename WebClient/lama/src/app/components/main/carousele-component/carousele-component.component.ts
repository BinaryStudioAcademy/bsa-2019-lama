import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import {
  style,
  state,
  animate,
  transition,
  trigger
} from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-carousele-component',
  templateUrl: './carousele-component.component.html',
  styleUrls: ['./carousele-component.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarouseleComponentComponent implements OnInit, OnDestroy {
  @Input() photoId: number;
  items: PhotoRaw[] = [];
  imageUrls: string[] = [];
  style = false;
  @Input() isEnabled: boolean;
  finished = false;
  unsubscribe = new Subject();

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService
      .getSimilarPhotos(this.photoId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(images => {
        images.forEach(element => {
          this.fileService
            .getPhoto(element.blob256Id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(url => {
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
