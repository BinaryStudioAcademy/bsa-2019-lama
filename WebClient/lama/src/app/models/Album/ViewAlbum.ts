import { PhotoRaw } from '../Photo/photoRaw';
import { User } from '../User/user';

export class ViewAlbum {
  id: number;
  title: string;
  photo: PhotoRaw;
  photoAlbums: PhotoRaw[];
  name: string;
  user: User;

  constructor(id: number, title: string, photo: PhotoRaw, photoAlbums: PhotoRaw[], user: User) {
    this.id = id;
    this.title = title;
    this.name = title;
    this.photo = photo;
    this.photoAlbums = photoAlbums;
    this.user = user;
  }
}
