import { Injectable } from '@angular/core';
import { PhotoRaw } from '../models/Photo/photoRaw';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  photos: PhotoRaw[] = [];
  constructor() { }
}
