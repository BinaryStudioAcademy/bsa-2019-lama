import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CreateAlbumModule } from '../create-album-module/create-album.module';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { PhotoUploadModalComponent } from './photo-upload-modal/photo-upload-modal.component';
import { SharedModule } from '../shared.module';
import { CropImageComponent } from './crop-image/crop-image.component';
import { UiModule } from '../ui/ui.module';
import { RotateImageComponent } from './rotate-image/rotate-image.component';
import { ShareByEmailModalComponent } from './share-modal/share-by-email-modal/share-by-email-modal.component';
import { ShareByLinkModalComponent } from './share-modal/share-by-link-modal/share-by-link-modal.component';
import { ShareAlbumComponent } from './share-modal/share-album/share-album.component';
import { ShareAlbumByLinkComponent } from './share-modal/share-album-by-link/share-album-by-link.component';
import { ShareAlbumByEmailComponent } from './share-modal/share-album-by-email/share-album-by-email.component';
import { ShareModalComponent } from './share-modal/share-modal/share-modal.component';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { CommentService } from 'src/app/services';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AgmCoreModule } from '@agm/core';
import { EditPhotoComponent } from './edit-photo/edit-photo.component';
import { NotificationModule } from '../../notification/notification.module';
import { IsBlockedDirective } from 'src/app/directives/is-blocked.directive';
import { MemeColorDirective } from 'src/app/directives/meme-color.directive';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { CalendarModule } from '../../calendar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    SharedModule,
    ImageCropperModule,
    UiModule,
    BrowserAnimationsModule,
    CalendarModule,
    NotificationModule,
    CreateAlbumModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAurCxOEuKDAeV4mGW0Xrf2AoLm-tY6pcI',
      libraries: ['places'],
      language: 'en'
    })
  ],
  providers: [CommentService],
  declarations: [
    PhotoModalComponent,
    PhotoUploadModalComponent,
    EditModalComponent,
    CropImageComponent,
    RotateImageComponent,
    ShareModalComponent,
    ShareByEmailModalComponent,
    ShareByLinkModalComponent,
    ShareAlbumComponent,
    ShareAlbumByLinkComponent,
    ShareAlbumByEmailComponent,
    CommentsListComponent,
    EditPhotoComponent,
    DatePickerComponent,
    IsBlockedDirective,
    MemeColorDirective,
    DeleteModalComponent,
    GoogleMapComponent
  ],
  exports: [
    PhotoModalComponent,
    PhotoUploadModalComponent,
    EditModalComponent,
    ShareModalComponent,
    ShareByEmailModalComponent,
    ShareByLinkModalComponent,
    ShareAlbumComponent,
    ShareAlbumByLinkComponent,
    ShareAlbumByEmailComponent,
    DeleteModalComponent
  ],
  entryComponents: [
    PhotoUploadModalComponent,
    PhotoModalComponent,
    EditModalComponent,
    ShareModalComponent,
    ShareByEmailModalComponent,
    ShareByLinkModalComponent,
    ShareAlbumComponent,
    ShareAlbumByLinkComponent,
    ShareAlbumByEmailComponent,
    DatePickerComponent
  ],
  bootstrap: [DatePickerComponent]
})
export class ModalModule {}
