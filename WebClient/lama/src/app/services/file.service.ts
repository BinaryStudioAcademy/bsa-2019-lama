import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Photo, UpdatedPhotoResultDTO, UpdatePhotoDTO } from '../models';

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
  
  public async getImageBase64(url: string): Promise<string>
  {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) =>
    {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  public update(photoToUpdate: UpdatePhotoDTO): Observable<UpdatedPhotoResultDTO>
  {
    return this.client.put(`${environment.lamaApiUrl}/api/photo`, photoToUpdate)
            .pipe(map(res => res as UpdatedPhotoResultDTO));
  }
  public getFirstGuidFromString(str: string): string
  {
    return str.match('(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}')[0];
  }
  receivePhoto() {
    return this.client.get(`${environment.lamaApiUrl}/api/photo`);
  }
}
