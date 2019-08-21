import { Injectable } from '@angular/core';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileService } from './file.service';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZipService {
  constructor(private fileService: FileService) {}

  public urlToPromise(url) {
    return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  public downloadImages(photos: PhotoRaw[]) {
    const zip = new JSZip();
    const filenames: string[] = [];
    const observables: Observable<string>[] = [];
    photos.forEach(element => {
      filenames.push(element.name);
      observables.push(this.fileService.getPhoto(element.blobId));
    });
    Observable.forkJoin(observables).subscribe(data => {
      for (let i = 0; i < filenames.length; i++) {
        zip.file(filenames[i], this.urlToPromise(data[i], { binary: true }));
      }
      zip.generateAsync({ type: 'blob' }).then(blob => {
        saveAs(blob, 'images.zip');
      });
    });
  }
}
