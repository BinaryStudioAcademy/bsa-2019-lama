import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PhotoToDeleteRestoreDTO } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { FileService } from 'src/app/services';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { NotifierService } from 'angular-notifier';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-duplicates-modal',
  templateUrl: './duplicates-modal.component.html',
  styleUrls: ['./duplicates-modal.component.sass']
})
export class DuplicatesModalComponent implements OnInit, OnDestroy {
  @Input('duplicatePhotos') receivedDuplicates: UploadPhotoResultDTO[][] = [];
  receivedIds: number[] = [];
  @Output() Change = new EventEmitter<number[]>();
  @Output() Click = new EventEmitter<boolean>();
  duplicatesUrls: string[] = [];
  duplicatesWithCount = new Map<string, number>();
  isActive = true;
  isShow = false;
  unsubscribe = new Subject();
  constructor(
    private fileService: FileService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    // this.countDuplicates();
    this.getDuplicatesUrls();
  }

  toggleModal() {
    this.isActive = !this.isActive;
    this.Click.emit(false);
  }

  removeDuplicates() {
    const flattenedDuplicates = [].concat.apply([], this.receivedDuplicates);
    const toDelete = flattenedDuplicates.length
      ? flattenedDuplicates.map(
          photo => new PhotoToDeleteRestoreDTO(photo.id)
        )
      : flattenedDuplicates.map(id => new PhotoToDeleteRestoreDTO(id));
    this.fileService.deletePhotosPermanently(toDelete)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
      response => {
        this.notifier.notify('success', 'Duplicates removed successfully');
      },
      error =>
        this.notifier.notify('error', 'Error occured while removing duplicates')
    );
    this.Change.emit(toDelete.map(x => x.id));
    this.toggleModal();
  }

  countDuplicates() {
    this.receivedDuplicates.forEach(duplicateArray => {
      this.duplicatesWithCount.set(duplicateArray[0].blob256Id, duplicateArray.length);
    });
  }

  getDuplicatesUrls() {
    // const firstDuplicateOfEachSet = this.receivedDuplicates.map(x => x[0]);
    if (this.receivedDuplicates.length) {
      this.receivedDuplicates.forEach(duplicate => {
        this.fileService
          .getPhoto(duplicate[0].blob256Id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(url => {
            this.duplicatesWithCount.set(url, duplicate.length);
          });
      });
    } else if (this.receivedIds) {
      this.receivedIds.forEach(item => {
        this.fileService.get(item)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(it => {
          this.fileService
            .getPhoto(it.blob256Id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(url => {
              this.duplicatesUrls.push(url);
            });
        });
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
