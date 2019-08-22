import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  AfterViewInit
} from '@angular/core';
import { read } from 'fs';
import { FileService } from 'src/app/services/file.service';
import { Photo } from 'src/app/models';
import imageCompression from 'browser-image-compression';
import { environment } from '../../../../environments/environment';
import { UploadPhotoResultDTO } from 'src/app/models/Photo/uploadPhotoResultDTO';
import { load, dump, insert, TagValues, helper, remove } from 'piexifjs';
import { NotifierService } from 'angular-notifier';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'photo-upload-modal',
  templateUrl: './photo-upload-modal.component.html',
  styleUrls: ['./photo-upload-modal.component.sass']
})
export class PhotoUploadModalComponent implements OnInit {
  isActive: boolean;
  photos: Photo[] = [];
  desc: string[] = [];
  showSpinner = false;
  geoCoder;
  address: string;
  @Output()
  addToListEvent: EventEmitter<UploadPhotoResultDTO[]> = new EventEmitter<
    UploadPhotoResultDTO[]
  >();

  constructor(
    private fileService: FileService,
    private notifier: NotifierService,
    private mapsAPILoader: MapsAPILoader
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  saveChanges() {
    const userId = localStorage.getItem('userId');
    for (let i = 0; i < this.photos.length; i++) {
      this.photos[i] = {
        imageUrl: this.photos[i].imageUrl,
        description: this.desc[i],
        authorId: parseInt(userId, 10),
        filename: this.photos[i].filename,
        location: this.photos[i].location
      };
    }

    this.fileService.sendPhoto(this.photos).subscribe(
      uploadedPhotos => {
        this.addToListEvent.emit(uploadedPhotos);
        this.toggleModal();
      },
      error => this.notifier.notify('error', 'Error sending photos')
    );
  }

  async onFileSelected(event) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      await this.onFileDropped(files);
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude }, region: 'us' },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0].formatted_address);
            this.address = results[0].formatted_address;
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  async onFileDropped(files: File[]) {
    this.showSpinner = true;
    this.photos = [];
    let latitude;
    let longitude;
    for (const file of files) {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const exifObj = load(await this.toBase64(file));
        const field = 'GPS';
        if (exifObj[field][1] === 'N') {
          latitude = this.ConvertDMSToDD(
            exifObj[field][2][0][0],
            exifObj[field][2][1][0],
            exifObj[field][2][2][0] / exifObj[field][2][2][1],
            exifObj[field][1]
          );
          longitude = this.ConvertDMSToDD(
            exifObj[field][4][0][0],
            exifObj[field][4][0][0],
            exifObj[field][4][0][0] / exifObj[field][4][2][1],
            exifObj[field][3]
          );
        }
        console.log(latitude);
        console.log(longitude);
        this.getAddress(latitude, longitude);
        const d = dump(exifObj);
        const compressedFile = await imageCompression(
          file,
          environment.compressionOptions
        );
        const base64 = await this.toBase64(compressedFile);
        remove(base64);
        const modifiedObject = insert(d, base64);
        this.showSpinner = false;
        this.photos.push({
          imageUrl: modifiedObject,
          filename: file.name,
          location: this.address
        });
      } else {
        const compressedFile = await imageCompression(
          file,
          environment.compressionOptions
        );
        this.showSpinner = false;
        this.photos.push({
          imageUrl: await this.toBase64(compressedFile),
          filename: file.name,
          location: this.address
        });
      }
    }
  }

  ConvertDMSToDD(
    degrees: number,
    minutes: number,
    seconds: number,
    direction
  ): number {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  public toBase64(file): Promise<string> {
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
}
