import { Injectable } from '@angular/core';
import {  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.afAuth.idToken.pipe(mergeMap((token) => {
        this.authService.token = token;
        request = request.clone({setHeaders: {
        Authorization: `Bearer ${this.authService.token}`
      }});
        return next.handle(request);
    }));
  }
}
