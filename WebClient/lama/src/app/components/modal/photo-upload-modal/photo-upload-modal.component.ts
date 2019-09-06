import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';
import { Photo } from 'src/app/models';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { environment } from '../../../../environments/environment';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import {
  getLocation,
  getLatitude,
  getLongitude,
  getShortAddress,
  getFormattedAddress
} from 'src/app/export-functions/exif';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit, OnDestroy {
  isActive: boolean;
  photos: Photo[] = [];
  desc: string[] = [];
  duplicates: UploadPhotoResultDTO[] = [];
  showSpinner = false;
  geoCoder;
  address: string;
  showRemoveButton = false;
  duplicatesFound = false;
  unsubscribe = new Subject();
  @Output()
  addToListEvent: EventEmitter<UploadPhotoResultDTO[]> = new EventEmitter<
    UploadPhotoResultDTO[]
  >();
  loaded = true;

  constructor(
    private fileService: FileService,
    private notifier: NotifierService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private ng2ImgToolsService: Ng2ImgToolsService
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  saveChanges() {
    if (this.photos.length === 0) {
      this.notifier.notify('error', 'Error download photos');
      return;
    }
    this.showSpinner = true;
    const userId = localStorage.getItem('userId');
    for (let i = 0; i < this.photos.length; i++) {
      this.photos[i] = {
        imageUrl: this.photos[i].imageUrl,
        description: this.desc[i],
        authorId: parseInt(userId, 10),
        filename: this.photos[i].filename,
        location: this.photos[i].location,
        coordinates: this.photos[i].coordinates,
        shortLocation: this.photos[i].shortLocation
      };
    }
    this.fileService
      .sendPhotos(this.photos)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        uploadedPhotos => {
          const filteredPhotos = this.resolveDuplicates(uploadedPhotos);
          this.addToListEvent.emit(filteredPhotos);
          if (!this.duplicatesFound) {
            this.notifier.notify('success', 'Uploaded');
            this.toggleModal();
          } else {
            this.removeUploaded(filteredPhotos);
            this.showSpinner = false;
            this.notifier.notify(
              'warning',
              'This photos appear to be duplicates. Upload them anyway?'
            );
          }
        },
        error => this.notifier.notify('error', 'Error sending photos')
      );
  }

  uploadDuplicates() {
    this.fileService
      .uploadDuplicates(this.duplicates)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        uploadedDuplicates => {
          this.addToListEvent.emit(uploadedDuplicates);
          this.notifier.notify('success', 'Duplicates uploaded');
          this.toggleModal();
        },
        error => this.notifier.notify('error', 'Error sending photos')
      );
  }

  removeUploaded(filteredPhotos: UploadPhotoResultDTO[]) {
    filteredPhotos.forEach(filtered => {
      const index = this.photos.findIndex(
        photo => photo.filename === filtered.name
      );
      this.photos.splice(index, 1);
    });
  }

  resolveDuplicates(uploadedPhotos: UploadPhotoResultDTO[]) {
    if (uploadedPhotos.some(photo => photo.isDuplicate)) {
      this.duplicates = uploadedPhotos.filter(photo => photo.isDuplicate);
      uploadedPhotos = uploadedPhotos.filter(
        photo => !this.duplicates.includes(photo)
      );
      this.duplicatesFound = true;
    }
    return uploadedPhotos;
  }

  async onFileSelected(event) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      await this.onFileDropped(files);
    }
  }

  async onFileDropped(files: File[]) {
    this.loaded = false;
    this.showSpinner = true;

    for (const file of files) {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const exifObj = load(await this.toBase64(file));
        const field = 'GPS';
        const latitude = getLatitude(exifObj);
        const longitude = getLongitude(exifObj);
        const d = dump(exifObj);
        const compressedFile = await this.ng2ImgToolsService
          .compress([file], environment.compressionOptions.maxSizeMB)
          .subscribe(async result => {
            const base64 = await this.toBase64(result);
            remove(base64);
            const modifiedObject = insert(d, base64);
            this.showSpinner = false;
            if (latitude && longitude) {
              getLocation(latitude, longitude, this.geoCoder).then(location => {
                this.address = getFormattedAddress(location);
                const shortname = getShortAddress(location);
                this.photos.push({
                  imageUrl: modifiedObject,
                  filename: file.name,
                  location: this.address,
                  coordinates: latitude + ',' + longitude,
                  shortLocation: shortname
                });
              });
            } else {
              this.photos.push({
                imageUrl: modifiedObject,
                filename: file.name,
                location: this.address
              });
            }
          });
      } else {
        const compressedFile = this.ng2ImgToolsService
          .compress([file], environment.compressionOptions.maxSizeMB)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(async result => {
            this.showSpinner = false;
            this.photos.push({
              imageUrl: await this.toBase64(result),
              filename: file.name,
              location: this.address
            });
          });
      }
    }
    this.loaded = true;
  }

  toBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  toggleModal() {
    this.isActive = !this.isActive;
  }

  mouseEnterOverlayHandler() {
    this.showRemoveButton = true;
  }

  mouseLeftOverlayHandler() {
    this.showRemoveButton = false;
  }

  removePhoto(index: number) {
    if (index !== -1) {
      this.photos.splice(index, 1);
      this.duplicates.splice(index, 1);
    }
    if (this.photos.length === 0) {
      this.duplicatesFound = false;
    }
  }

  isDuplicate(photo: Photo) {
    return this.duplicates.some(duplicate => duplicate.name === photo.filename);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }
}
