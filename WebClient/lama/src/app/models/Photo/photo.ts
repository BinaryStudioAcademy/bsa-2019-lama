import { Like } from '../like';

export interface Photo
{
    imageUrl: string;
    authorId?: number;
    author?: string;
    description?: string;
    filename?: string;
}
