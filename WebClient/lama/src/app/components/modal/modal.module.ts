import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';

import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from './photo-upload-modal/photo-upload-modal.component';
import { SharedModule } from '../shared.module';
import { CropImageComponent } from './crop-image/crop-image.component';
import { SpinnerComponent } from '../ui/spinner/spinner.component';
import { UiModule } from '../ui/ui.module';


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
    PhotoModalComponent, PhotoUploadModalComponent, CropImageComponent
  ],
  exports:
  [
    PhotoModalComponent, PhotoUploadModalComponent
  ],
  entryComponents:
  [
    PhotoUploadModalComponent, PhotoModalComponent,
  ]
})
export class ModalModule { }
