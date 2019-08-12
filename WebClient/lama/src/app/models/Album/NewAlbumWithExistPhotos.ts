import { Photo } from '../Photo/photo';


export interface NewAlbumWithExistPhotos {
    title: string;
    authorId: number;
    photosId: number[];
}