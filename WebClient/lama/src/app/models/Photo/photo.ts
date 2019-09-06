export class Photo {
  imageUrl: string;
  authorId?: number;
  author?: string;
  description?: string;
  filename?: string;
  location?: string;
  coordinates?: string;
  shortLocation?: string;
  // tslint:disable-next-line: whitespace
  isDuplicate? = false;
}
