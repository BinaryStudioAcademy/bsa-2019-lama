import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Album } from '../models/Album/album';
import { ViewAlbum } from '../models/Album/ViewAlbum';
import { NewAlbum } from '../models/Album/NewAlbum';
import { NewAlbumWithExistPhotos } from '../models/Album/NewAlbumWithExistPhotos';
import { PhotoRaw } from '../models';
import { UpdateAlbum } from '../models/Album/updatedAlbum';

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

  public createAlbumWithExistPhotos(album: NewAlbumWithExistPhotos) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<Album>(this.baseUrl + this.routeAlbum + '/CreateWithExistPhoto', album , { headers });
  }

  public updateAlbumCover(album: UpdateAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<UpdateAlbum>(`${this.baseUrl}${this.routeAlbum}/updateCover`, album, {headers});
  }

  public updateAlbum(album: UpdateAlbum) {
      const headers = new HttpHeaders().set('content-type', 'application/json');
      return this.http.put<UpdateAlbum>(this.baseUrl + this.routeAlbum , album , { headers }).subscribe(e => console.log(e));
  }

  public ArchiveAlbum(photos: PhotoRaw[]) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<[]>(this.baseUrl + this.routeAlbum + '/ArchivePhotos' , photos , { headers });
  }

  public removeAlbum(albumId: number){
    return this.http.delete<number>(`${this.baseUrl}${this.routeAlbum}/${albumId}`);
  }
}
