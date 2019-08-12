import { Injectable } from '@angular/core';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { Photo } from '../models';
import { User } from '../models/User/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  photos: PhotoRaw[] = [];
  foundedPhotos: PhotoRaw[] = [];
  avatar: Photo;
  constructor() { }
}
