import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/User/user';
import { PhotoRaw } from '../models';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  getData(endPoint: string): Observable<User> {
    return this.http.get(
      `${environment.lamaApiUrl}/api/${endPoint}`
    ) as Observable<User>;
  }

  putData(endPoint: string, data: any) {
    return this.http.put(`${environment.lamaApiUrl}/api/${endPoint}`, data);
  }

  findPhotos(id: string, criteria: string): Observable<PhotoRaw[]> {
    return this.http.get(
      `${environment.lamaApiUrl}/api/photo/search/${id}/${criteria}`
    ) as Observable<PhotoRaw[]>;
  }
}
