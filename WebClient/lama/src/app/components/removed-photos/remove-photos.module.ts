import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { UiModule } from '../ui/ui.module';

import { DeletedPhotosComponent } from './deleted-photos/deleted-photos.component';
import { FileService } from 'src/app/services';


@NgModule(
{
  imports:
  [
    SharedModule, UiModule
  ],
  providers:
  [
    FileService
  ],
  declarations:
  [
    DeletedPhotosComponent
  ],
  exports:
  [
    DeletedPhotosComponent
  ]
})
export class RemovedPhotosModule { }
