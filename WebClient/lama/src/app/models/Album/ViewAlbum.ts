import { PhotoRaw } from '../Photo/photoRaw';

export interface ViewAlbum {
    id: number;
    title: string;
    photo: PhotoRaw;
    photoAlbums: PhotoRaw[];
    name: string;
}
