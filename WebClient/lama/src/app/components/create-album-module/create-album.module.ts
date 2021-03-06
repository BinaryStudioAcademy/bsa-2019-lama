import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAlbumModalComponent } from './create-album-modal/create-album-modal.component';
import { ChooseStoragePhotosComponent } from './choose-storage-photos/choose-storage-photos.component';
import {  ChoosePhotoComponent } from './choose-photo/choose-photo.component';
import {NotificationModule} from '../../notification/notification.module';

@NgModule({
  declarations: [
    CreateAlbumModalComponent,
    ChoosePhotoComponent,
    ChooseStoragePhotosComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    NotificationModule
  ],
  exports: [

  ],
  entryComponents: [
    CreateAlbumModalComponent,
    ChooseStoragePhotosComponent
  ]
})
export class CreateAlbumModule { }
