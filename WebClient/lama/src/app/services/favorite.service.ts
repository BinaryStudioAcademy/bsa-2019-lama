import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private baseUrl: string = environment.lamaApiUrl + '/api/favorite/';
  private ids: string = "ids/";
  private photos: string = "photos/";
  constructor(private _http: HttpClient) { 
  }

  getFavoritesIds(userId: number): Observable<any> {
      return this._http.get<number[]>(this.baseUrl+this.ids+userId);
  }

  getFavoritesPhotos(userId: number): Observable<any> {
    return this._http.get<Favorite[]>(this.baseUrl+this.photos+userId);
}

  createFavorite(){

  }

  deleteFavorite(){

  }
}
