export class TextOnPhotoDTO {
  language: string;
  textAngle: number;
  orientation: string;
  regions: Region[];
}

class Word {
  boundingBox: string;
  text: string;
}

class Line {
  boundingBox: string;
  words: Word[];
}

class Region {
  boundingBox: string;
  lines: Line[];
}
