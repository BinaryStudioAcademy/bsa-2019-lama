import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLandingPageComponent } from './components/landing/main-landing-page/main-landing-page.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { MainPageHeaderComponent } from './components/main/main-page-header/main-page-header.component';
import { MainLeftActionsSidebarComponent } from './components/main/main-left-actions-sidebar/main-left-actions-sidebar.component';
import { MainLeftActionItemComponent } from './components/main/main-left-action-item/main-left-action-item.component';
import { MainContentContainerComponent } from './components/main/main-content-container/main-content-container.component';
import { MainPhotosContainerComponent } from './components/main/main-photos-container/main-photos-container.component';
import { MainPhotoComponent } from './components/main/main-photo/main-photo.component';
import { MainAlbumsContainerComponent } from './components/main/main-albums-container/main-albums-container.component';
import { MainAlbumComponent } from './components/main/main-album/main-album.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import {
  SharedModule,
  ModalModule,
  RemovedPhotosModule,
  UiModule,
  LandingModule
} from 'src/app/components';
import { CreateAlbumModule } from './components/create-album-module/create-album.module';
import { SharedPageComponent } from './components/shared-page/shared-page.component';
import { SharedPageHeaderComponent } from './components/shared-page/shared-page-header/shared-page-header.component';
import { FavoriteDirective } from './directives/favorite.directive';
import { CheckFavoriteDirective } from './directives/check-favorite.directive';
import { SharedPageAlbumComponent } from './components/shared-page/shared-page-album/shared-page-album.component';
import { SetAlbumCoverModalComponent } from './components/modal/set-album-cover-modal/set-album-cover-modal.component';
import { ChooseAlbumCoverComponent } from './components/choose-album-cover/choose-album-cover.component';
import { NotificationModule } from './notification/notification.module';
import { ViewAlbumComponent } from './components/viev-album-module/view-album/view-album.component';
// tslint:disable-next-line:max-line-length
import { AddPhotosToAlbumModalComponent } from './components/viev-album-module/add-photos-to-album-modal/add-photos-to-album-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLandingPageComponent,
    MainPageComponent,
    MainPageHeaderComponent,
    MainLeftActionsSidebarComponent,
    MainLeftActionItemComponent,
    MainContentContainerComponent,
    MainPhotosContainerComponent,
    MainPhotoComponent,
    ProfileComponent,
    MainAlbumsContainerComponent,
    MainAlbumComponent,
    ViewAlbumComponent,
    AddPhotosToAlbumModalComponent,
    SharedPageComponent,
    SharedPageHeaderComponent,
    FavoriteDirective,
    CheckFavoriteDirective,
    SharedPageAlbumComponent,
    SetAlbumCoverModalComponent,
    ChooseAlbumCoverComponent
  ],
  imports: [
    SharedModule,
    LandingModule,
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    UiModule,
    RemovedPhotosModule,
    ModalModule,
    HttpClientModule,
    FormsModule,
    CreateAlbumModule,
    ReactiveFormsModule,
    NotificationModule
  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddPhotosToAlbumModalComponent]
})
export class AppModule {}
