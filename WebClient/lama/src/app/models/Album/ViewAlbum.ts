import { PhotoRaw } from '../Photo/photoRaw';

export class ViewAlbum {
  id: number;
  title: string;
  photo: PhotoRaw;
  photoAlbums: PhotoRaw[];
  name: string;

  constructor(id: number, title: string, photo: PhotoRaw, photoAlbums: PhotoRaw[]) {
    this.id = id;
    this.title = title;
    this.name = title;
    this.photo = photo;
    this.photoAlbums = photoAlbums;
  }
}
