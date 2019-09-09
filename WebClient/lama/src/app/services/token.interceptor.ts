import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.afAuth.idToken.pipe(
      mergeMap(token => {
        this.authService.token = token;
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authService.token}`
          }
        });
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            if (
              error.url.includes('api/users') ||
              error.url.includes('/negotiate')
            ) {
              this.authService
                .doLogout()
                .then((this.authService.token = null))
                .then(() => {
                  this.authService.user = null;
                  this.router.navigate(['/']);
                  localStorage.clear();
                });
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
