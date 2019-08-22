import { Photo } from '../Photo/photo';

export interface UserCreate {
    firstName: string;
    lastName: string;
    email: string;
    photo: Photo;
}
