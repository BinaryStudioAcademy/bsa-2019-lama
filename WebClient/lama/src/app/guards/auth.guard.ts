import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean{
      if(state.url.indexOf('shared') !== -1){
        return true;
      }
      return this.afAuth.authState.pipe(
        take(1),
        map(user => !!user),
        tap((loggedIn) => {
          if(!loggedIn){
            this.router.navigate(['landing']);
          }
        }
       )
      );
    }

  public canActivateChild(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.canActivate(next,state);
    }
  }





