import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { SharedPhoto } from '../models/Photo/sharedPhoto';
import { SharedPageDataset } from '../models/sharedPageDataset';
import { SharedAlbum } from 'src/app/models/Album/SharedAlbum';
import { ViewAlbum } from '../models/Album/ViewAlbum';

@Injectable({
  providedIn: 'root'
})
export class SharingService {
  private lamaApiUrl: string = environment.lamaApiUrl;
  private routePrefix = 'api/sharedphotos';

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/plain; charset=utf-8' })
  };

  sendSharedPhoto(sharedPhoto: SharedPhoto) {
    return this.httpClient.post<SharedPhoto>(
      `${this.lamaApiUrl}/${this.routePrefix}`,
      sharedPhoto
    );
  }

  sendSharedAlbum(sharedAlbum: SharedAlbum) {
    return this.httpClient.post<SharedAlbum>(
      `${this.lamaApiUrl}/api/sharedalbums`,
      sharedAlbum
    );
  }

  deleteSharedAlbum(albumId: number) {
    return this.httpClient.delete(
      `${this.lamaApiUrl}/api/sharedalbums/${albumId}`
    );
  }

  deleteSharedAlbumForUser(albumId: number, userId: number) {
    return this.httpClient.delete(
      `${this.lamaApiUrl}/api/sharedalbums/${albumId}/${userId}`
    );
  }

  getSharedAlbums(userId: number) {
    return this.httpClient.get<ViewAlbum[]>(
      `${this.lamaApiUrl}/api/sharedalbums/user/${userId}`
    );
  }

  getPhotoEntity(photoId: number) {
    return this.httpClient.get<SharedPhoto>(
      `${this.lamaApiUrl}/${this.routePrefix}/${photoId}`
    );
  }

  getSharingPageUserData(photoId: number) {
    return this.httpClient.get<SharedPageDataset>(
      `${this.lamaApiUrl}/${this.routePrefix}/${photoId}`
    );
  }

  updatePhotoEntityWithSharedLink(photoId: number, payload: string) {
    return this.httpClient.put<PhotoRaw>(
      `${this.lamaApiUrl}/${this.routePrefix}/${photoId}`,
      payload,
      this.httpOptions
    );
  }
}
