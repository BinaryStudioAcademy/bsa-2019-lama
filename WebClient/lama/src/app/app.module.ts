import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLandingPageComponent } from './components/main-landing-page/main-landing-page.component';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule
} from '@angular/material';
import { LandingLoginComponent } from './components/landing-login/landing-login.component';
import { LandingFeatureBlockComponent } from './components/landing-feature-block/landing-feature-block.component';
import { LandingFeaturesContainerComponent } from './components/landing-features-container/landing-features-container.component';
import { LandingBottomLoginComponent } from './components/landing-bottom-login/landing-bottom-login.component';
import { LangingFooterComponent } from './components/langing-footer/langing-footer.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageHeaderComponent } from './components/main-page-header/main-page-header.component';
import { MainLeftActionsSidebarComponent } from './components/main-left-actions-sidebar/main-left-actions-sidebar.component';
import { MainLeftActionItemComponent } from './components/main-left-action-item/main-left-action-item.component';
import { MainContentContainerComponent } from './components/main-content-container/main-content-container.component';
import { MainPhotosDateBlockComponent } from './components/main-photos-date-block/main-photos-date-block.component';
import { MainPhotosContainerComponent } from './components/main-photos-container/main-photos-container.component';
import { MainPhotoComponent } from './components/main-photo/main-photo.component';
import { RouterModule } from '@angular/router';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLandingPageComponent,
    LandingLoginComponent,
    LandingFeatureBlockComponent,
    LandingFeaturesContainerComponent,
    LandingBottomLoginComponent,
    LangingFooterComponent,
    MainPageComponent,
    MainPageHeaderComponent,
    MainLeftActionsSidebarComponent,
    MainLeftActionItemComponent,
    MainContentContainerComponent,
    MainPhotosDateBlockComponent,
    MainPhotosContainerComponent,
    MainPhotoComponent,
    PhotoModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:
  [
    PhotoModalComponent
  ]
})
export class AppModule { }
