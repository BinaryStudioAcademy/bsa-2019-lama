// use this to show deleted photos on client
export interface DeletedPhotoList {
  id: number;
  blob256Id: string;
  isMarked: boolean;
  imageUrl?: string;
}
