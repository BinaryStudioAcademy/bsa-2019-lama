import { Injectable } from '@angular/core';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }

  public urlToPromise(url) {
    return new Promise( (resolve, reject) => {
        JSZipUtils.getBinaryContent(url, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    }
public downloadImages(photos) {
    const zip = new JSZip();
    photos.forEach(element => {
      const filename = element.blobId.replace(/^.*[\\\/]/, '');
      zip.file(filename, this.urlToPromise(element.blobId), { binary: true});
    });
    zip.generateAsync({type: 'blob'})
    .then((blob) => {
        // see FileSaver.js
        saveAs(blob, 'images.zip');
    });
  }
}
