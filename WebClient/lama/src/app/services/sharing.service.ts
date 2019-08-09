import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { SharedPhoto } from '../models/Photo/sharedPhoto';
import { SharedPageDataset } from '../models/sharedPageDataset';


@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private lamaApiUrl: string = environment.lamaApiUrl;
  private routePrefix ='api/sharedphotos';

  constructor(private httpClient: HttpClient) { }

  public getPhotoEntity(photoId: number): Observable<SharedPhoto> {
    return this.httpClient.get<SharedPhoto>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`);
  }

  public getSharingPageUserData(photoId: number): Observable<SharedPageDataset>{
    return this.httpClient.get<SharedPageDataset>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`);
  }

  public updatePhotoEntityWithSharedLink(photoId:number, sharedLink: string): Observable<HttpResponse<any>>{
    return this.httpClient.post<any>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`,sharedLink, {observe: 'response'});
  }
}
