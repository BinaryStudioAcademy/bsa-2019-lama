import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Album } from '../models/Album/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {


  public baseUrl: string = environment.lamaApiUrl;
  public routeAlbum = '/api/album';

  public headers = new HttpHeaders();

  constructor(private http: HttpClient) {
  }

  public getAlbums(httpParams?: any) {
     // return this.http.get<...>(this.baseUrl+ this.routeAlbum,{ observe: 'response',headers: this.headers, params: httpParams });
  }

  public createAlbumWithNewPhotos(album: Album) {
      const headers = new HttpHeaders().set('content-type', 'application/json');
      return this.http.post<Album>(this.baseUrl + this.routeAlbum + '/CreateWithNewPhoto', album , { headers });
  }

  public createAlbumWithExistPhotos(album: Album) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<Album>(this.baseUrl + this.routeAlbum + '/CreateWithExistPhoto', album , { headers });
}

  public updateAlbum(album: Album) {
      const headers = new HttpHeaders().set('content-type', 'application/json');
      return this.http.put<Album>(this.baseUrl + this.routeAlbum , album , { headers });
  }
}
