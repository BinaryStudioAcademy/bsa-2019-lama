import { Reaction } from '../Reaction/Reaction';

export interface UploadPhotoResultDTO
{
    id: number;
    blobId: string;
    blob64Id: string;
    blob256Id: string;
    originalBlobId: string;
    sharedLink: string;
    isDeleted: boolean;
    description: string;
    reaction: Reaction[];
};
