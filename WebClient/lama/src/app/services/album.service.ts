import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Album } from '../models/Album/album';
import { ViewAlbum } from '../models/Album/ViewAlbum';
import { NewAlbum } from '../models/Album/NewAlbum';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {


  public baseUrl: string = environment.lamaApiUrl;
  public routeAlbum = '/api/album';

  public headers = new HttpHeaders();

  constructor(private http: HttpClient) {
  }


  public getAlbums(userId:string , httpParams?: any) {
      return this.http.get<ViewAlbum[]>(this.baseUrl + this.routeAlbum + `/${userId}`, { observe: 'response', headers: this.headers, params: httpParams });
  }

  public getAlbum(userId: number , httpParams?: any) {
    return this.http.get<ViewAlbum>(this.baseUrl + this.routeAlbum + '/album'+ `/${userId}`, { observe: 'response', headers: this.headers, params: httpParams });
  }
  public createAlbumWithNewPhotos(album: NewAlbum) {
      const headers = new HttpHeaders().set('content-type', 'application/json');
      return this.http.post<Album>(this.baseUrl + this.routeAlbum + '/CreateWithNewPhoto', album , { headers });
  }

  public createAlbumWithExistPhotos(album: NewAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<Album>(this.baseUrl + this.routeAlbum + '/CreateWithExistPhoto', album , { headers });
}

  public updateAlbum(album: Album) {
      const headers = new HttpHeaders().set('content-type', 'application/json');
      return this.http.put<Album>(this.baseUrl + this.routeAlbum , album , { headers });
  }
}
