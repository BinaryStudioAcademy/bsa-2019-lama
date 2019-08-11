import { Injectable } from '@angular/core';
import { PhotoRaw } from '../models/Photo/photoRaw';
import { Photo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  photos: PhotoRaw[] = [];
  avatar: Photo;
  constructor() { }
}
