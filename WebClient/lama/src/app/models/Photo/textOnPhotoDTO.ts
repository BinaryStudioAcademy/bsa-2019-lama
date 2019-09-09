export interface TextOnPhotoDTO {
  language: string;
  textAngle: number;
  orientation: string;
  regions: Region[];
}

class Region {
  boundingBox: string;
  lines: Line[];
}

class Line {
  boundingBox: string;
  words: Word[];
}

class Word {
  boundingBox: string;
  text: string;
}
