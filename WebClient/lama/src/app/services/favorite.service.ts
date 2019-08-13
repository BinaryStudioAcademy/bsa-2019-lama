import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  public baseUrl: string = environment.lamaApiUrl + '/api/favorite/';
  constructor(private _http: Http) { 
  }

  getFavoritesIds(userId: number): Observable<any> {
      return this._http.get(this.baseUrl+"ids/"+userId).pipe(map(response => {
        return response.json();
      }));
  }

  getFavoritesPhotos(userId: number): Observable<any> {
    return this._http.get(this.baseUrl+"photos/"+userId).pipe(map(response => {
      return response.json();
    }));
}

  updateFavorites(userId: number, favorites: []): Observable<any> {
    return this._http.put(this.baseUrl+userId, favorites);
  }
}
