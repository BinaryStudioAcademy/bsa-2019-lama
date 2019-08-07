import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharingService {

  public blobStorageUrl: string = environment.storageUrl;
  public routePrefix ='api/photos';

  constructor(private httpClient: HttpClient) { }


  public getSharableLink(): Observable<string> {
    return this.httpClient.get<string>(`${this.blobStorageUrl}/${this.routePrefix}`);
  }
}
