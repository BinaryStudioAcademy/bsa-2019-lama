export interface PhotoRaw {
    id: number,
    blobId: string,
    blob16Id: string,
    blob32Id: string,
    originalBlobId: string,
    sharedLink: string,
    isDeleted: string,
    uploadDate: Date,
    description: string,
    location: string,
    userId: number,
    categoryId: number
}