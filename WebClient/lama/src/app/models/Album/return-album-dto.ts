import { PhotoRaw } from '../Photo/photoRaw';

export interface ReturnAlbumDTO {
    id: number;
    title: string;
    photo: PhotoRaw;
    photoAlbums: PhotoRaw[];
}
