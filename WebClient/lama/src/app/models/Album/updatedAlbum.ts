import { Title } from '@angular/platform-browser';

export interface UpdateAlbum {
    id: number;
    title: string;
    coverId?: number;
    photoIds: number[];
  }
