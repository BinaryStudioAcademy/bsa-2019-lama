import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UpdatePhotoDTO, ImageEditedArgs, MenuItem } from 'src/app/models';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { FileService } from 'src/app/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.sass']
})
export class EditModalComponent implements OnInit, OnDestroy {

  @Input()
  public photo: PhotoRaw;
  public imageUrl: string;
  clickedTabsItem: string = null;
  unsubscribe = new Subject();

  @Output() Done = new EventEmitter<ImageEditedArgs>();

  save(editedImage: ImageEditedArgs) {
    this.Done.emit(editedImage);
  }

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getPhoto(this.photo.blobId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(url => this.imageUrl = url);
  }

  displayCrop() {
  this.clickedTabsItem = 'crop';
  }

  displayRotate() {
  this.clickedTabsItem = 'rotate';
  }

  displayMeme() {
    this.clickedTabsItem = 'meme';
    }

  closeModal() {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
