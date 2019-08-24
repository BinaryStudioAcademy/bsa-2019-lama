import { Photo } from '../Photo/photo';

export interface AlbumNewPhotos {
  UserId: number;
  AlbumId: number;
  photos: Photo[];
}
