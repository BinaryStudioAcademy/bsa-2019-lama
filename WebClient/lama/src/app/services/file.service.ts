import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Photo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private client: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  sendPhoto(photos: Photo[]) {
    this.client.post<Photo[]>(`${environment.lamaApiUrl}/api/photo`, photos, this.httpOptions).subscribe((e) => console.log(e));
  }

  receivePhoto() {
    return this.client.get(`${environment.lamaApiUrl}/api/photo`);
  }
}
