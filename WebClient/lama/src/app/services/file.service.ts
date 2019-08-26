import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { load, dump, insert } from 'piexifjs';

import {
  PhotoRaw,
  Photo,
  UpdatedPhotoResultDTO,
  UpdatePhotoDTO,
  DeletedPhotoDTO,
  PhotoToDeleteRestoreDTO
} from '../models';
import { UploadPhotoResultDTO } from '../models/Photo/uploadPhotoResultDTO';
import { NewLike } from '../models/Reaction/NewLike';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private client: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  sendPhotos(photos: Photo[]): Observable<UploadPhotoResultDTO[]> {
    return this.client.post<UploadPhotoResultDTO[]>(
      `${environment.lamaApiUrl}/api/photo`,
      photos,
      this.httpOptions
    );
  }


  uploadDuplicates(duplicates: UploadPhotoResultDTO[]) {
    return this.client.post<UploadPhotoResultDTO[]>(`${environment.lamaApiUrl}/api/photo/duplicates`, duplicates, this.httpOptions);
  }

  async getImageBase64(url: string): Promise<string> {
  getSearchHistory(id: number) {
    return this.client.get<string[]>(
      `${environment.lamaApiUrl}/api/photo/search_history/${id}`
    );
  }

  getSearchSuggestions(id: number, criteria: string) {
    return this.client.get<{ [name: string]: string[] }>(
      `${environment.lamaApiUrl}/api/photo/search/fields/${id}/${criteria}`
    );
  }

  public async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  getExif(imageBase64: string): any {
    return load(imageBase64);
  }

  copyExif(from: string, to: string): string {
    let modified = to;

    if (from.indexOf('image/jpeg') !== -1 || from.indexOf('image/jpg') !== -1) {
      const exifObj = load(from);
      const d = dump(exifObj);
      modified = insert(d, to);
    }
    return modified;
  }

  update(
    photoToUpdate: UpdatePhotoDTO
  ): Observable<UpdatedPhotoResultDTO> {
    return this.client
      .put(`${environment.lamaApiUrl}/api/photo`, photoToUpdate)
      .pipe(map(res => res as UpdatedPhotoResultDTO));
  }

  ReactionPhoto(NewReaction: NewLike): Observable<number> {
    return this.client.post<number>(
      `${environment.lamaApiUrl}/api/photo/reaction`,
      NewReaction
    );
  }

  RemoveReactionPhoto(Reaction: NewLike) {
    return this.client.post(
      `${environment.lamaApiUrl}/api/photo/removereaction`,
      Reaction
    );
  }

  getPhoto(name: string) {
    return this.client.get<string>(
      `${environment.lamaApiUrl}/api/photo/${name}`
    );
  }

  getDuplicates(id: number) {
    return this.client.get<UploadPhotoResultDTO[]>(`${environment.lamaApiUrl}/api/photo/duplicates/${id}`);
  }

  receivePhoto(): Observable<PhotoRaw[]> {
    return this.client.get<PhotoRaw[]>(
      `${environment.lamaApiUrl}/api/photo`,
      this.httpOptions
    );
  }

  receiveUsersPhotos(userId: number): Observable<PhotoRaw[]> {
    return this.client
      .get(
        `${environment.lamaApiUrl}/api/photo/user/${userId}`,
        this.httpOptions
      )
      .pipe(map(res => res as PhotoRaw[]));
  }

  receiveUsersPhotosRange(
    userId: number,
    startId: number,
    count: number
  ): Observable<PhotoRaw[]> {
    this.httpOptions.headers.append('userId', `${userId}`);
    this.httpOptions.headers.append('startId', `${startId}`);
    this.httpOptions.headers.append('count', `${count}`);
    return this.client
      .get(`${environment.lamaApiUrl}/api/photo/rangeUserPhotos`, {
        headers: { id: `${userId}`, startId: `${startId}`, count: `${count}` }
      })
      .pipe(map(res => res as PhotoRaw[]));
  }

  markPhotoAsDeleted(photosToDeleteId: number): Observable<object> {
    return this.client.delete(
      `${environment.lamaApiUrl}/api/photo/${photosToDeleteId}`
    );
  }

  getDeletedPhotos(userId: number): Observable<DeletedPhotoDTO[]> {
    return this.client
      .get(`${environment.lamaApiUrl}/api/photo/deleted/${userId}`)
      .pipe(map(res => res as DeletedPhotoDTO[]));
  }

  deletePhotosPermanently(
    photosToDelete: PhotoToDeleteRestoreDTO[]
  ): Observable<object> {
    return this.client.post(
      `${environment.lamaApiUrl}/api/photo/delete_permanently`,
      photosToDelete
    );
  }

  restoresDeletedPhotos(
    photosToRestore: PhotoToDeleteRestoreDTO[]
  ): Observable<object> {
    return this.client.post(
      `${environment.lamaApiUrl}/api/photo/restore`,
      photosToRestore
    );
  }
}
