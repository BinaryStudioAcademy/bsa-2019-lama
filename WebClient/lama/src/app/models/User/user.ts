import { Photo } from '../Photo/photo';

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    avatarId?: number;
}
