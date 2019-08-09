import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLandingPageComponent } from './components/landing/main-landing-page/main-landing-page.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { MainAlbumsContainerComponent } from './components/main/main-albums-container/main-albums-container.component';
import { MainPhotosContainerComponent } from './components/main/main-photos-container/main-photos-container.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewAlbumComponent } from './components/view-album-module/view-album/view-album.component';
import { SharedPageComponent } from './components/shared-page/shared-page.component';
  import { from } from 'rxjs';
import { LoggedInGuard } from './guards/logged-in.guard';


// определение дочерних маршрутов
const itemRoutes: Routes = [
  { path: '', component:  MainPhotosContainerComponent},
  { path: 'albums', component: MainAlbumsContainerComponent}
];

const routes: Routes = [
  {path: '', component: MainLandingPageComponent, canActivate:[LoggedInGuard]},
  {path: 'main', component: MainPageComponent, children: itemRoutes, canActivate: [AuthGuard] },
  {path: 'album', component: ViewAlbumComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'shared/:userdata', component: SharedPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
