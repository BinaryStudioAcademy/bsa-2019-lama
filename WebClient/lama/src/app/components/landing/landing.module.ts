import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { UiModule } from '../ui/ui.module';


import { LandingLoginComponent } from '../../components/landing/landing-login/landing-login.component';
import { LandingFeatureBlockComponent } from '../../components/landing/landing-feature-block/landing-feature-block.component';
import { LandingFeaturesContainerComponent } from '../../components/landing/landing-features-container/landing-features-container.component';
import { LandingBottomLoginComponent } from '../../components/landing/landing-bottom-login/landing-bottom-login.component';
import { LandingFooterComponent } from '../../components/landing/landing-footer/landing-footer.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';


@NgModule(
{
  imports:
  [
    SharedModule, UiModule
  ],
  declarations:
  [
    LandingLoginComponent, LandingFeatureBlockComponent, LandingFeaturesContainerComponent, LandingBottomLoginComponent, LandingFooterComponent,
    AuthModalComponent
  ],
  exports:
  [
    LandingLoginComponent, LandingFeatureBlockComponent, LandingFeaturesContainerComponent, LandingBottomLoginComponent, LandingFooterComponent,
    AuthModalComponent
  ]
})
export class LandingModule { }
