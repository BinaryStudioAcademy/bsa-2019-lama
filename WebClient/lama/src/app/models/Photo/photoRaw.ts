import { Reaction } from '../Reaction/Reaction';

export interface PhotoRaw
{
    id?: number;
    blobId: string;
    blob64Id?: string;
    blob256Id?: string;
    originalBlobId?: string;
    sharedLink?: string;
    isDeleted?: boolean;
    uploadDate?: Date;
    description?: string;
    location?: string;
    userId?: number;
    categoryId?: number;
    reaction: Reaction[];
}