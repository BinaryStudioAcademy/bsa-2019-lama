import { Like } from '../like';
import { LikeDTO } from '../Reaction/LikeDTO';


//TODO this class should be injected in Photo class
export interface PhotoWithSocial{
  imageUrl: string;
  authorId?: number;
  author?: string;
  description?: string;
  likes: LikeDTO[];
  comments: Comment[];
}
