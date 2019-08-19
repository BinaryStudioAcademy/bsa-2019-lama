import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';
import {CreateAlbumModule} from '../create-album-module/create-album.module'

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
import { EqualIdDirective } from 'src/app/directives/equal-id.directive';

@NgModule(
{
  imports:
  [
    SharedModule,
    ImageCropperModule,
    UiModule,
    CreateAlbumModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAurCxOEuKDAeV4mGW0Xrf2AoLm-tY6pcI',
      libraries: ['places']
    })
  ],
  providers:
  [
    CommentService,
  ],
  declarations:
  [
    PhotoModalComponent, PhotoUploadModalComponent, EditModalComponent,
    CropImageComponent, RotateImageComponent,
    ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent,
    ShareAlbumComponent, ShareAlbumByLinkComponent, ShareAlbumByEmailComponent,
    CommentsListComponent,
    EditPhotoComponent,
    EqualIdDirective
  ],
  exports:
  [
    PhotoModalComponent, PhotoUploadModalComponent, EditModalComponent,
    ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent,
    ShareAlbumComponent, ShareAlbumByLinkComponent, ShareAlbumByEmailComponent
  ],
  entryComponents:
  [
    PhotoUploadModalComponent, PhotoModalComponent, EditModalComponent,
    ShareModalComponent, ShareByEmailModalComponent, ShareByLinkModalComponent,
    ShareAlbumComponent, ShareAlbumByLinkComponent, ShareAlbumByEmailComponent

  ]
})
export class ModalModule { }
