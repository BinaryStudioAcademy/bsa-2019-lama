import { PhotoRaw } from '../Photo/photoRaw';
import { User } from '../User/user';

export interface ViewAlbum {
  id: number;
  title: string;
  photo: PhotoRaw;
  photoAlbums: PhotoRaw[];
  name: string;
}
