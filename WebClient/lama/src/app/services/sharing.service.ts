import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharingService {

  public blobStorageUrl: string = environment.storageUrl;
  public routePrefix ='api/fakeblob';

  constructor(private httpClient: HttpClient) { }

  //TODO: change signature depending on which way we will get blob from storage
  public getSharableLink(): Observable<Blob>{
    return this.httpClient.get(`${this.blobStorageUrl}/${this.routePrefix}`,{responseType: 'blob'});
  }
}
