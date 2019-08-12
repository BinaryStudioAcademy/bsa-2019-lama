import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';

import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from './photo-upload-modal/photo-upload-modal.component';
import { SharedModule } from '../shared.module';
import { CropImageComponent } from './crop-image/crop-image.component';
import { UiModule } from '../ui/ui.module';
import { RotateImageComponent } from './rotate-image/rotate-image.component'
import { ShareByEmailModalComponent } from './share-modal/share-by-email-modal/share-by-email-modal.component';
import { ShareByLinkModalComponent } from './share-modal/share-by-link-modal/share-by-link-modal.component';
import { ShareModalComponent } from './share-modal/share-modal/share-modal.component';

@NgModule(
{
  imports:
  [
    SharedModule,
    ImageCropperModule,
    UiModule
  ],
  declarations:
  [
    PhotoModalComponent, PhotoUploadModalComponent, CropImageComponent, ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent, RotateImageComponent
  ],
  exports:
  [
    PhotoModalComponent, PhotoUploadModalComponent, ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent
  ],
  entryComponents:
  [
    PhotoUploadModalComponent, PhotoModalComponent, ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent
  ]
})
export class ModalModule { }
