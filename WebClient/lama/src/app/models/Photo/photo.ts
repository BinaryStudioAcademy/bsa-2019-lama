export class Photo {
  imageUrl: string;
  authorId?: number;
  author?: string;
  description?: string;
  filename?: string;
  location?: string;
  // tslint:disable-next-line: whitespace
  isDuplicate? = false;
}
