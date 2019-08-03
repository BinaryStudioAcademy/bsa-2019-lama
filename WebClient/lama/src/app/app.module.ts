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


@NgModule({
  declarations: [
    AppComponent,
    MainLandingPageComponent,
    LandingLoginComponent,
    LandingFeatureBlockComponent,
    LandingFeaturesContainerComponent,
    LandingBottomLoginComponent,
    LangingFooterComponent,
  ],
  imports: [
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
  bootstrap: [AppComponent]
})
export class AppModule { }
