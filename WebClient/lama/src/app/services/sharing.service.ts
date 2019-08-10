import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
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

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'text/plain; charset=utf-8'})
  }


  public getPhotoEntity(photoId: number): Observable<SharedPhoto> {
    return this.httpClient.get<SharedPhoto>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`);
  }

  public getSharingPageUserData(photoId: number): Observable<SharedPageDataset>{
    return this.httpClient.get<SharedPageDataset>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`);
  }

  public updatePhotoEntityWithSharedLink(photoId:number, payload: string): Observable<HttpResponse<any>>{
    return this.httpClient.put<any>(`${this.lamaApiUrl}/${this.routePrefix}/${photoId}`, payload, this.httpOptions);
  }
}
