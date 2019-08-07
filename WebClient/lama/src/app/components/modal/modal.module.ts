import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';

import { PhotoModalComponent } from './photo-modal/photo-modal.component';

import { PhotoUploadModalComponent } from './photo-upload-modal/photo-upload-modal.component';
import { SharedModule } from '../shared.module';
import { CropImageComponent } from './crop-image/crop-image.component';
import {ShareModalComponent} from './share-modal/share-modal.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';


@NgModule(
{
  imports:
  [
    SharedModule,
    ImageCropperModule
  ],
  declarations:
  [
    PhotoModalComponent, PhotoUploadModalComponent, CropImageComponent,  ShareModalComponent
  ],
  exports:
  [
    PhotoModalComponent, PhotoUploadModalComponent, ShareModalComponent
  ],
  entryComponents:
  [
    PhotoUploadModalComponent, PhotoModalComponent, AuthModalComponent, ShareModalComponent
    ]
})
export class ModalModule { }
