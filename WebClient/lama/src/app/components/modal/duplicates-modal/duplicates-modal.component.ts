import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoToDeleteRestoreDTO } from 'src/app/models';
import { environment } from 'src/environments/environment';
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
  @Output() Change = new EventEmitter<number>();
  duplicatesUrls: string[] = [];
  isActive = true;
  constructor(private fileService: FileService, private notifier: NotifierService) {

   }

  ngOnInit() {
    this.getDuplicatesUrls();
  }

  toggleModal() {
    this.isActive = !this.isActive;
  }

  removeDuplicates() {
    this.toggleModal();
    const toDelete = this.receivedDuplicates.map(photo => new PhotoToDeleteRestoreDTO(photo.id));
    this.fileService.deletePhotosPermanently(toDelete).subscribe(response => {
      toDelete.forEach(photo => {
        this.Change.emit(photo.id);
      });
    });
  }

  getDuplicatesUrls() {
    this.receivedDuplicates.forEach(duplicate => {
      this.fileService.getPhoto(duplicate.blob256Id).subscribe(url => {
        this.duplicatesUrls.push(url);
      });
    });
  }
}
