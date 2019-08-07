import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import {take, map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

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
            this.router.navigate(['/']);
          }
         }
        )
      );
    }
  }





