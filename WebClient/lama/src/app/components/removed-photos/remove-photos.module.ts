import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { UiModule } from '../ui/ui.module';

import { DeletedPhotosComponent } from './deleted-photos/deleted-photos.component';
import { FileService } from 'src/app/services';
import { NotificationModule } from '../../notification/notification.module';

@NgModule({
  imports: [SharedModule, UiModule, NotificationModule],
  providers: [FileService],
  declarations: [DeletedPhotosComponent],
  exports: [DeletedPhotosComponent]
})
export class RemovedPhotosModule {}
