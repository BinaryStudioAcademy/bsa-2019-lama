import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhotoRaw, Photo, UpdatedPhotoResultDTO, UpdatePhotoDTO, DeletedPhotoDTO, PhotoToDeleteRestoreDTO } from '../models';
import { UploadPhotoResultDTO } from '../models/Photo/uploadPhotoResultDTO';
import { NewLike } from '../models/Reaction/NewLike';

@Injectable({
  providedIn: 'root'
})
export class FileService 
{

  constructor(private client: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  public sendPhoto(photos: Photo[]): Observable<UploadPhotoResultDTO[]>
  {
    return this.client.post<UploadPhotoResultDTO[]>(`${environment.lamaApiUrl}/api/photo`, photos, this.httpOptions);
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
  public ReactionPhoto(NewReaction: NewLike)
  {
    return this.client.post(`${environment.lamaApiUrl}/api/photo/reaction`, NewReaction);
  }
  public getFirstGuidFromString(str: string): string
  {
    return str.match('(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}')[0];
  }
  public receivePhoto(): Observable<PhotoRaw[]>
  { 
    return this.client.get<PhotoRaw[]>(`${environment.lamaApiUrl}/api/photo`, this.httpOptions);
  }
  public receiveUsersPhotos(userId:number): Observable<PhotoRaw[]>
  { 
    return this.client.get(`${environment.lamaApiUrl}/api/photo/user/${userId}`, this.httpOptions)
      .pipe(map(res => res as PhotoRaw[]));
  }
  public markPhotoAsDeleted(photosToDeleteId: number): Observable<object>
  { 
    return this.client.delete(`${environment.lamaApiUrl}/api/photo/${photosToDeleteId}`);
  }
  public getDeletedPhotos(): Observable<DeletedPhotoDTO[]>
  {
    return this.client.get(`${environment.lamaApiUrl}/api/photo/deleted`)
      .pipe(map(res => res as DeletedPhotoDTO[]));
  }
  public deletePhotosPermanently(photosToDelete: PhotoToDeleteRestoreDTO[]): Observable<object>
  {    
    return this.client.post(`${environment.lamaApiUrl}/api/photo/delete_permanently`, photosToDelete);
  }
  
  public restoresDeletedPhotos(photosToRestore: PhotoToDeleteRestoreDTO[]): Observable<object>
  {    
    return this.client.post(`${environment.lamaApiUrl}/api/photo/restore`, photosToRestore)
  }
}
