import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor} from '@angular/common/http';
import { AuthService } from './auth.service';
import 'rxjs/operator/mergeMap';
import { mergeMap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.afAuth.idToken.pipe(mergeMap((token) => {
        this.authService.token = token;
        request = request.clone({setHeaders: {
        Authorization: `Bearer ${token}`
      }});
        return next.handle(request);
    }));
  }
}
