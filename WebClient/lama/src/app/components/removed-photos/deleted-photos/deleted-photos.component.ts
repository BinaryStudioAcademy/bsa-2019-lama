import { Component, OnInit, OnDestroy } from '@angular/core';

import { map, takeUntil } from 'rxjs/operators';

import { FileService } from 'src/app/services';

import { DeletedPhotoList, PhotoToDeleteRestoreDTO } from 'src/app/models';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-deleted-photos',
  templateUrl: './deleted-photos.component.html',
  styleUrls: ['./deleted-photos.component.sass']
})
export class DeletedPhotosComponent implements OnInit, OnDestroy {
  // properties
  public countSelectedPhtoto: number;
  public deletedPhotos: DeletedPhotoList[];
  isShowSpinner = true;
  unsubscribe = new Subject();

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
      .pipe(map(dto => dto as DeletedPhotoList[]),
        takeUntil(this.unsubscribe))
      .subscribe(
        items => {
          this.deletedPhotos = items;
          if (this.deletedPhotos) {
            this.deletedPhotos.forEach(item => {
              this.fileService.getPhoto(item.blob256Id)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(url => {
                item.imageUrl = url;
                this.isShowSpinner = false;
              });
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
    const photosToRestore: PhotoToDeleteRestoreDTO[] = this.getPhotos();
    this.fileService
        .restoresDeletedPhotos(photosToRestore)
        .subscribe(
          response => this.removeSelectedPhotoFromView(),
          error => this.notifier.notify('error', 'Error restoring photo')
        );
  }

  public deleteSelectedPhoto(): void {
    const photosToDelete: PhotoToDeleteRestoreDTO[] = this.getPhotos();
    this.fileService
      .deletePhotosPermanently(photosToDelete)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        response => this.removeSelectedPhotoFromView(),
        error => this.notifier.notify('error', 'Error deleting photo')
      );
  }

  private getPhotos() {
    if (this.countSelectedPhtoto) {
     return this.getSelectedItem();
    } else {
      return this.deletedPhotos;
    }
  }

  private getSelectedItem(): PhotoToDeleteRestoreDTO[] {
    return this.deletedPhotos.filter(p => p.isMarked);
  }

  private removeSelectedPhotoFromView(): void {
    if (!this.countSelectedPhtoto) {
      this.deletedPhotos = this.deletedPhotos.filter(p => p.isMarked);
    } else {
      this.deletedPhotos = this.deletedPhotos.filter(p => !p.isMarked);
    }
    this.countSelectedPhtoto = 0;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
