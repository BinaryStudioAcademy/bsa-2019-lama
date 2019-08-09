import { Photo } from '../Photo/photo';

export interface UserCreate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: Photo;
}