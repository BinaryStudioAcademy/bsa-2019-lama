import { Injectable } from '@angular/core';

@Injectable()
export class ImageService
{
  public async getImageBase64(url: string): Promise<string>
  {
    // TODO: get this from elasticsearch

    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) =>
    {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
