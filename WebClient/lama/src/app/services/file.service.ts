import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private client: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  sendPhoto(photos: string[]) {
    this.client.post<string[]>(`${environment.lamaApiUrl}/api/photo`, photos, this.httpOptions).subscribe((e) => console.log(e));
  }
}
