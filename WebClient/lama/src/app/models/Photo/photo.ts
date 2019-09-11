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

  constructor(url: string, authorId: number, filename: string) {
    this.imageUrl = url;
    this.authorId = authorId;
    this.filename = filename;
  }
}
