import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router, CanActivateChild } from '@angular/router';
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
    state: RouterStateSnapshot): Observable<boolean>{
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
      state: RouterStateSnapshot): Observable<boolean> {
      return this.canActivate(next,state);
    }
  }





