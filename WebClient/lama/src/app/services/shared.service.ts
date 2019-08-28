import { Injectable } from '@angular/core';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { Photo } from '../models';
import { User } from '../models/User/user';
import { UploadPhotoResultDTO } from '../models/Photo/uploadPhotoResultDTO';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  photos: UploadPhotoResultDTO[] = [];
  foundPhotos: PhotoRaw[] = [];
  avatar: Photo;
  isSearchTriggered: boolean;
  isSearchTriggeredAtLeastOnce: boolean;
  restorePhotos: boolean;
  constructor() { }
}
