import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/User/user';
import { PhotoRaw } from '../models';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  getData(endPoint: string) {
    return this.http.get(
      `${environment.lamaApiUrl}/api/${endPoint}`
    ) as Observable<User>;
  }

  getDataWithHeader(endPoint: string, data: any) {
    return this.http.get(`${environment.lamaApiUrl}/api/${endPoint}`, {
      headers: data
    }) as Observable<User>;
  }

  putData(endPoint: string, data: any) {
    return this.http.put(`${environment.lamaApiUrl}/api/${endPoint}`, data);
  }

  findPhotos(id: string, criteria: string) {
    return this.http.get(
      `${environment.lamaApiUrl}/api/photo/search/${id}/${criteria}`
    ) as Observable<PhotoRaw[]>;
  }
}
