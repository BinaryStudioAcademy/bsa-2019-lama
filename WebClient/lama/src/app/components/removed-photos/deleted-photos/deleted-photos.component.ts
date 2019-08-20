import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { FileService } from 'src/app/services';

import { DeletedPhotoList, PhotoToDeleteRestoreDTO } from 'src/app/models';

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
  constructor(private fileService: FileService) { }

  public ngOnInit(): void {
    this.countSelectedPhtoto = 0;
    const userId = parseInt(localStorage.getItem('userId'), 10);
    this.fileService.getDeletedPhotos(userId)
      .pipe(map(dto => dto as DeletedPhotoList[]))
      .subscribe(items => {console.log(items); this.deletedPhotos = items });
  }

  // methods
  public selectPhoto(photo: DeletedPhotoList): void {
    photo.isMarked = !photo.isMarked;

    this.countSelectedPhtoto += photo.isMarked ? 1 : -1;
  }

  public restoreSelectedPhoto(): void {
    const photosToRestore: PhotoToDeleteRestoreDTO[]
      = this.getSelectedItem();

    this.fileService.restoresDeletedPhotos(photosToRestore)
      .subscribe(response => this.removeSelectedPhotoFromView());

  }

  public deleteSelectedPhoto(): void {
    const photosToDelete: PhotoToDeleteRestoreDTO[]
      = this.getSelectedItem();

    this.fileService.deletePhotosPermanently(photosToDelete)
      .subscribe(response => this.removeSelectedPhotoFromView());
  }

  private getSelectedItem(): PhotoToDeleteRestoreDTO[] {
    return this.deletedPhotos.filter(p => p.isMarked);
  }

  private removeSelectedPhotoFromView(): void {
    this.deletedPhotos = this.deletedPhotos.filter(p => !p.isMarked);
    this.countSelectedPhtoto = 0;
  }
}
