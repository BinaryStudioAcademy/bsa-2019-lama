import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Album } from '../models/Album/album';
import { ViewAlbum } from '../models/Album/ViewAlbum';
import { NewAlbum } from '../models/Album/NewAlbum';
import { NewAlbumWithExistPhotos } from '../models/Album/NewAlbumWithExistPhotos';
import { PhotoRaw, PhotoToDeleteRestoreDTO } from '../models';
import { PhotoDetailsAlbum } from '../models/Album/PhotodetailsAlbum';
import { UpdateAlbum } from '../models/Album/updatedAlbum';
import { Observable } from 'rxjs';
import { ReturnAlbumDTO } from '../models/Album/return-album-dto';
import { AlbumExistPhotos } from '../models/Album/AlbumExistPhotos';
import { AlbumNewPhotos } from '../models/Album/AlbumNewPhotos';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  public baseUrl: string = environment.lamaApiUrl;
  public routeAlbum = '/api/album';

  public headers = new HttpHeaders();

  constructor(private http: HttpClient) {}

  public GetPhotoDetailsAlbums(photoId: number, httpParams?: any) {
    return this.http.get<PhotoDetailsAlbum[]>(
      this.baseUrl + this.routeAlbum + '/details' + `/${photoId}`,
      { observe: 'response', headers: this.headers, params: httpParams }
    );
  }
  public getAlbums(userId: number, httpParams?: any) {
    return this.http.get<ViewAlbum[]>(
      this.baseUrl + this.routeAlbum + `/${userId}`,
      { observe: 'response', headers: this.headers, params: httpParams }
    );
  }

  public getAlbum(Id: number, httpParams?: any) {
    return this.http.get<ViewAlbum>(
      this.baseUrl + this.routeAlbum + '/album' + `/${Id}`,
      { observe: 'response', headers: this.headers, params: httpParams }
    );
  }
  public createAlbumWithNewPhotos(album: NewAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<ReturnAlbumDTO>(
      this.baseUrl + this.routeAlbum + '/CreateWithNewPhoto',
      album,
      { headers }
    );
  }
  public addExistPhotosToAlbum(albumExistPhotos: AlbumExistPhotos) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<PhotoRaw[]>(
      this.baseUrl + this.routeAlbum + '/AlbumExistPhotos',
      albumExistPhotos,
      { headers }
    );
  }
  public addNewPhotosToAlbum(album: AlbumNewPhotos) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<PhotoRaw[]>(
      this.baseUrl + this.routeAlbum + '/AlbumNewPhotos',
      album,
      { headers }
    );
  }
  createEmptyAlbum(album: NewAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<ViewAlbum>(
      this.baseUrl + this.routeAlbum + '/CreateEmptyAlbum',
      album,
      { headers }
    );
  }

  public createAlbumWithExistPhotos(album: NewAlbumWithExistPhotos) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<ViewAlbum>(
      this.baseUrl + this.routeAlbum + '/CreateWithExistPhoto',
      album,
      { headers }
    );
  }

  public updateAlbumCover(album: UpdateAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<UpdateAlbum>(
      `${this.baseUrl}${this.routeAlbum}/updateCover`,
      album,
      { headers }
    );
  }

  public updateAlbum(album: UpdateAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http
      .put<UpdateAlbum>(this.baseUrl + this.routeAlbum, album, { headers })
      .subscribe(e => console.log(e));
  }

  public updateAlbumTitle(album: UpdateAlbum) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http
      .put<UpdateAlbum>(`${this.baseUrl}${this.routeAlbum}/title/`, album, { headers });
  }

  public ArchiveAlbum(photos: string[]) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<[]>(
      this.baseUrl + this.routeAlbum + '/ArchivePhotos',
      photos,
      { headers }
    );
  }

  public removeAlbum(albumId: number) {
    return this.http.delete<number>(
      `${this.baseUrl}${this.routeAlbum}/${albumId}`
    );
  }

  removeAlbumCover(albumId: number) {
    return this.http.delete(
      `${this.baseUrl}${this.routeAlbum}/cover/${albumId}`
    );
  }

  removePhotosFromAlbum(albumId: number, photos: number[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: photos
    };
    return this.http.delete(
      `${this.baseUrl}${this.routeAlbum}/photos/${albumId}`,
      httpOptions
    );
  }
}
