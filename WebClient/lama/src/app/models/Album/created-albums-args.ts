import { PhotoRaw } from 'src/app/models';

export interface CreatedAlbumsArgs {
  id: number;
  name: string;
  title: string;
  photo?: PhotoRaw;
}
