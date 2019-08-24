import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLandingPageComponent } from './components/landing/main-landing-page/main-landing-page.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { MainAlbumsContainerComponent } from './components/main/main-albums-container/main-albums-container.component';
import { MainPhotosContainerComponent } from './components/main/main-photos-container/main-photos-container.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewAlbumComponent } from './components/view-album/view-album.component';
import { SharedPageComponent } from './components/shared-page/shared-page.component';
import { DeletedPhotosComponent } from './components/removed-photos/deleted-photos/deleted-photos.component';
import { SharedPageAlbumComponent } from './components/shared-page/shared-page-album/shared-page-album.component';

import { LoggedInGuard, AuthGuard } from './guards';

const routes: Routes =
[
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'main', redirectTo: 'main/photos', pathMatch: 'full'},

  { path: 'landing', component: MainLandingPageComponent, canActivate: [LoggedInGuard] },

  {
    path: 'main', component: MainPageComponent, canActivate: [AuthGuard],
    children:
    [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [

          { path: 'photos', component:  MainPhotosContainerComponent },
          { path: 'albums', component: MainAlbumsContainerComponent },
          { path: 'album/:id', component: ViewAlbumComponent },
          { path: 'profile', component: ProfileComponent },
          { path: 'shared/:userdata', component: SharedPageComponent },
          { path: 'shared/album/:userdata', component: SharedPageAlbumComponent },
          { path: 'bin', component: DeletedPhotosComponent },
        ]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
