import { Photo } from '../Photo/photo';

export class User
{
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  photo?: Photo;
  photoUrl?: string;
}
