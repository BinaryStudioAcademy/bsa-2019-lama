import { Like } from './like';
import { PhotoState } from './Photo/photoState';
import { User } from './User/user';


export interface SharedPageDataset{
  id: number;
  elasticId: number;
  photoState: PhotoState;
  likes: Like[];
  comments: Comment[];
  user: User;

}





