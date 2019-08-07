export class SharedPhotoEntity
{
  userId: number;
  sharedImageUrl: string;

  constructor(){
    this.userId = 0;
    this.sharedImageUrl = '';
  }
}
