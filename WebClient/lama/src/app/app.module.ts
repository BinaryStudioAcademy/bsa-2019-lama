import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLandingPageComponent } from './components/landing/main-landing-page/main-landing-page.component';

import { LandingLoginComponent } from './components/landing/landing-login/landing-login.component';
import { LandingFeatureBlockComponent } from './components/landing/landing-feature-block/landing-feature-block.component';
import { LandingFeaturesContainerComponent } from './components/landing/landing-features-container/landing-features-container.component';
import { LandingBottomLoginComponent } from './components/landing/landing-bottom-login/landing-bottom-login.component';
import { LandingFooterComponent } from './components/landing/landing-footer/landing-footer.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { MainPageHeaderComponent } from './components/main/main-page-header/main-page-header.component';
import { MainLeftActionsSidebarComponent } from './components/main/main-left-actions-sidebar/main-left-actions-sidebar.component';
import { MainLeftActionItemComponent } from './components/main/main-left-action-item/main-left-action-item.component';
import { MainContentContainerComponent } from './components/main/main-content-container/main-content-container.component';
import { MainPhotosContainerComponent } from './components/main/main-photos-container/main-photos-container.component';
import { MainPhotoComponent } from './components/main/main-photo/main-photo.component';
import { RouterModule } from '@angular/router';
import { MainAlbumsContainerComponent } from './components/main/main-albums-container/main-albums-container.component';
import { MainAlbumComponent } from './components/main/main-album/main-album.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import {ViewAlbumComponent} from './components/view-album/view-album.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { SharedModule, ModalModule } from 'src/app/components';
import { CreateAlbumModule} from './components/create-album-module/create-album.module';

@NgModule({
  declarations: [
    AppComponent,
    MainLandingPageComponent,
    LandingLoginComponent,
    LandingFeatureBlockComponent,
    LandingFeaturesContainerComponent,
    LandingBottomLoginComponent,
    LandingFooterComponent,
    MainPageComponent,
    MainPageHeaderComponent,
    MainLeftActionsSidebarComponent,
    MainLeftActionItemComponent,
    MainContentContainerComponent,
    MainPhotosContainerComponent,
    MainPhotoComponent,
    MainAlbumsContainerComponent,
    MainAlbumComponent,
    AuthModalComponent,
    ViewAlbumComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalModule,
    HttpClientModule,
    FormsModule,
    CreateAlbumModule
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents:
  [
  ]
})
export class AppModule { }
