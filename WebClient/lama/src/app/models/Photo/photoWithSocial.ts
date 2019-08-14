import { Like } from '../like';


//TODO this class should be injected in Photo class
export interface PhotoWithSocial{
  imageUrl: string;
  authorId?: number;
  author?: string;
  description?: string;
  likes: Like[];
  comments: Comment[];
}
