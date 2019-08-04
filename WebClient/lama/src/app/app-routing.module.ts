import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLandingPageComponent } from './components/main-landing-page/main-landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';


const routes: Routes = [
  {path: '', component: MainLandingPageComponent},
  {path: 'login', component: MainPageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
