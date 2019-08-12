import { Photo } from '../Photo/photo';
import { User } from '../User/user';

export interface Album {
    id: number;
    title: string;
    imageUrl: string;
    author: User;
    photos: Photo[];
}
