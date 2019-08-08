import { Photo } from '../Photo/photo';

export interface Album {
    name: string;
    imageUrl: string;
    author: string;
    photos: Photo[];
}
