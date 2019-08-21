import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Favorite } from '../models/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private baseUrl: string = environment.lamaApiUrl + '/api/favorite/';
  private ids = 'ids/';
  private photos = 'photos/';
  constructor(private http: HttpClient) {
  }

  getFavoritesIds(userId: number): Observable<any> {
      return this.http.get<number[]>(this.baseUrl + this.ids + userId);
  }

  getFavoritesPhotos(userId: number): Observable<any> {
    return this.http.get<Favorite[]>(this.baseUrl + this.photos + userId);
}

  createFavorite(favorite: Favorite): Observable<any> {
    return this.http.post<Favorite>(this.baseUrl, favorite);
  }

  deleteFavorite(userId: number, photoId: number): Observable<any> {
    return this.http.delete(this.baseUrl + userId + '/' + photoId);
  }

  deleteAllFavorites(userId: number): Observable<any> {
    return this.http.delete(this.baseUrl + userId);
  }
}
