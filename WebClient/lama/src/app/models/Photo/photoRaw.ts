import { Like } from '../Reaction/Like';
import { LikeDTO } from '../Reaction/LikeDTO';
import { ImageTagDTO } from './imageTagDTO';

export interface PhotoRaw {
  id?: number;
  name?: string;
  blobId: string;
  blob64Id?: string;
  blob256Id?: string;
  originalBlobId?: string;
  sharedLink?: string;
  isDeleted?: boolean;
  isDuplicate?: boolean;
  uploadDate?: Date;
  description?: string;
  location?: string;
  userId?: number;
  categoryId?: number;
  coordinates?: string;
  reactions: LikeDTO[];
  tags: ImageTagDTO[];
}
