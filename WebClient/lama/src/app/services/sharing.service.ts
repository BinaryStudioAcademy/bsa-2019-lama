import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { SharedPhoto } from '../models/Photo/sharedPhoto';


@Injectable({
  providedIn: 'root'
})
export class SharingService {

  public blobStorageUrl: string = environment.storageUrl;
  public routePrefix ='api/photos';

  constructor(private httpClient: HttpClient) { }


  public getPhotoEntity(photoId: number): Observable<SharedPhoto> {
    return this.httpClient.get<SharedPhoto>(`${this.blobStorageUrl}/${this.routePrefix}/${photoId}`);
  }
}
