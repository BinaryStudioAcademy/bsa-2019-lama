import { Photo } from '../Photo/photo';

export class User
{
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: Photo;
  photoUrl?: string;
}
