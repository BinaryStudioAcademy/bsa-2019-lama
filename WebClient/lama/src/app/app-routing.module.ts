import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLandingPageComponent } from './components/landing/main-landing-page/main-landing-page.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { AuthGuard } from './guards/auth.guard';
import { SharedPhotoComponent } from './components/shared-photo/shared-photo.component';


const routes: Routes = [
  {path: '', component: MainLandingPageComponent},
  {path: 'login', component: MainPageComponent, canActivate:[AuthGuard]},
  {path: 'shared/:userdata', component: SharedPhotoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
