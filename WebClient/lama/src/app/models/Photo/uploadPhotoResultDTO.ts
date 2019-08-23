import { LikeDTO } from '../Reaction/LikeDTO';

export interface UploadPhotoResultDTO {
  id: number;
  blobId: string;
  blob64Id: string;
  blob256Id: string;
  userId: number;
  originalBlobId: string;
  sharedLink: string;
  isDeleted: boolean;
  description: string;
  reactions: LikeDTO[];
}
