import { Injectable } from '@angular/core';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileService } from './file.service';
import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { AlbumService } from './album.service';

@Injectable({
  providedIn: 'root'
})
export class ZipService {
  constructor(
    private fileService: FileService,
    private albumService: AlbumService
  ) {}

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

  ConvertToImage(ArchivePhotos, names) {
    const zip = new JSZip();
    for (let i = 0; i < ArchivePhotos.length; i++) {
      zip.file(`${names[i]}`, ArchivePhotos[i], {
        base64: true
      });
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'images.zip');
    });
  }
  public downloadImages(photos: PhotoRaw[]) {
    const NameOfFiles = [];
    const names = [];
    for (const item of photos) {
      NameOfFiles.push(item.blobId);
      names.push(item.name);
    }
    this.albumService.ArchiveAlbum(NameOfFiles).subscribe(x => {
      this.ConvertToImage(x, names);
    });
  }
}
