import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoToDeleteRestoreDTO } from 'src/app/models';
import { FileService } from 'src/app/services';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-duplicates-modal',
  templateUrl: './duplicates-modal.component.html',
  styleUrls: ['./duplicates-modal.component.sass']
})
export class DuplicatesModalComponent implements OnInit {

  @Input('duplicatePhotos') receivedDuplicates: UploadPhotoResultDTO[] = [];
  @Output() Change = new EventEmitter<number[]>();
  @Output() Click = new EventEmitter<boolean>();
  duplicatesUrls: string[] = [];
  isActive = true;
  constructor(private fileService: FileService, private notifier: NotifierService) {

   }

  ngOnInit() {
    this.getDuplicatesUrls();
  }

  toggleModal() {
    this.isActive = !this.isActive;
    this.Click.emit(false);
  }

  removeDuplicates() {
    const toDelete = this.receivedDuplicates.map(photo => new PhotoToDeleteRestoreDTO(photo.id));
    this.fileService.deletePhotosPermanently(toDelete).subscribe(response => {
      this.notifier.notify('success', 'Duplicates removed successfully');
    },
    error => this.notifier.notify('error', 'Error occured while removing duplicates'));
    this.Change.emit(toDelete.map(x => x.id));
    this.toggleModal();
  }

  getDuplicatesUrls() {
    this.receivedDuplicates.forEach(duplicate => {
      this.fileService.getPhoto(duplicate.blob256Id).subscribe(url => {
        this.duplicatesUrls.push(url);
      });
    });
  }
}
