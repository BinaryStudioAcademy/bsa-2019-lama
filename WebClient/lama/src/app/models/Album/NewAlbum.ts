import { Photo } from '../Photo/photo';
import { User } from '../User/user';


export interface NewAlbum {
    title: string;
    photo: Photo;
    authorId: number;
    photos: Photo[];
}
