import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { FileService } from 'src/app/services';

import { DeletedPhotoList, PhotoToDeleteRestoreDTO } from 'src/app/models';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-deleted-photos',
  templateUrl: './deleted-photos.component.html',
  styleUrls: ['./deleted-photos.component.sass']
})
export class DeletedPhotosComponent implements OnInit {
  // properties
  public countSelectedPhtoto: number;
  public deletedPhotos: DeletedPhotoList[];

  // fields
  constructor(
    private fileService: FileService,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.countSelectedPhtoto = 0;
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.fileService
      .getDeletedPhotos(userId)
      .pipe(map(dto => dto as DeletedPhotoList[]))
      .subscribe(
        items => {
          this.deletedPhotos = items;
          if (this.deletedPhotos) {
            this.deletedPhotos.forEach(item => {
              this.fileService
                .getPhoto(item.blob256Id)
                .subscribe(url => (item.imageUrl = url));
            });
          }
        },
        error => this.notifier.notify('error', 'Error loading deleting photos')
      );
  }

  // methods
  public selectPhoto(photo: DeletedPhotoList): void {
    photo.isMarked = !photo.isMarked;

    this.countSelectedPhtoto += photo.isMarked ? 1 : -1;
  }

  public restoreSelectedPhoto(): void {
    const photosToRestore: PhotoToDeleteRestoreDTO[] = this.getSelectedItem();

    this.fileService
      .restoresDeletedPhotos(photosToRestore)
      .subscribe(
        response => this.removeSelectedPhotoFromView(),
        error => this.notifier.notify('error', 'Error restoring photo')
      );
  }

  public deleteSelectedPhoto(): void {
    const photosToDelete: PhotoToDeleteRestoreDTO[] = this.getSelectedItem();

    this.fileService
      .deletePhotosPermanently(photosToDelete)
      .subscribe(
        response => this.removeSelectedPhotoFromView(),
        error => this.notifier.notify('error', 'Error deleting photo')
      );
  }

  private getSelectedItem(): PhotoToDeleteRestoreDTO[] {
    return this.deletedPhotos.filter(p => p.isMarked);
  }
  private removeSelectedPhotoFromView(): void {
    this.deletedPhotos = this.deletedPhotos.filter(p => !p.isMarked);
    this.countSelectedPhtoto = 0;
  }
}
