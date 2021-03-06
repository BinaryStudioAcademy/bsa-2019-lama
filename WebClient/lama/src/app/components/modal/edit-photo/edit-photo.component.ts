import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  OnChanges,
  DoCheck,
  ElementRef
} from '@angular/core';
import { ImageEditedArgs, PhotoRaw } from 'src/app/models';
import { FileService } from 'src/app/services';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { createMem } from 'src/app/export-functions/meme';
import { Options } from 'ng5-slider';
import ImageFilters from 'node_modules/canvas-filters';
import { DomSanitizer } from '@angular/platform-browser';

declare const pixelsJS: any;

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.sass']
})
export class EditPhotoComponent {
  // fields
  private imageUrl: string;
  @Input()
  photoToEdit: PhotoRaw;
  @Input()
  imageToEditBase64: string;
  @Input()
  imageToEditBlobId: string;
  @Input()
  thumbnailUpdatedBase64: string;
  imageUpdated: string;
  imageUpdatedBase64: any;
  isMemeMode: boolean;
  isFiltersMode: boolean;
  upText: string;
  memeSaved: boolean;
  downText: string;
  colorPicker: string;
  brightness = 0;
  contrast = 0;
  filter = '';
  filters = [
    'vintage',
    'twenties',
    'evening',
    'cosmic',
    'darkify',
    'specks_redscale',
    'offset',
    'wood',
    'bluescale',
    'phase',
    'crimson',
    'coral',
    'serenity',
    'mellow',
    'ocean'
  ];

  private imageService: FileService;
  showRotateAndCrop = true;
  showMeme = false;
  isShown = false;
  brightnessOptions: Options = {
    floor: -100,
    ceil: 100
  };
  posterize = 16;
  posterizeOptions: Options = {
    floor: 2,
    ceil: 32
  };

  // properties
  @Input()
  public set imageToEdit(imageToCropUrl: string) {
    this.imageUrl = imageToCropUrl;

    this.imageService.getImageBase64(imageToCropUrl).then(res => {
      this.imageToEditBase64 = res;
      this.imageUpdatedBase64 = this.imageToEditBase64;
    });
  }

  @ViewChild('editor', { static: false, read: ImageCropperComponent })
  public imageEditor: ImageCropperComponent;

  public cropperMinWidth: number;
  public cropperMinHeight: number;

  public croppedImageWidth: number;
  public croppedImageHeight: number;

  // events
  @Output()
  public saveClickedEvent = new EventEmitter<ImageEditedArgs>();
  @Output()
  public resetClickedEvent = new EventEmitter();
  @Output()
  public cancelClickedEvent = new EventEmitter();

  // constructors
  constructor(imageService: FileService, private sanitizer: DomSanitizer) {
    this.isShown = true;
    this.imageService = imageService;
    this.cropperMinHeight = environment.photoEditing.crop.cropMinHeight;
    this.cropperMinWidth = environment.photoEditing.crop.cropMinWidth;
    this.colorPicker = '#ffffff';
  }

  changeBrightness() {}

  // methods
  public rotateLeftHandler() {
    this.imageEditor.rotateLeft();
  }

  public rotateRightHandler() {
    this.imageEditor.rotateRight();
  }

  public flipHorizontalHandler() {
    this.imageEditor.flipHorizontal();
  }
  public flipVerticalHandler() {
    this.imageEditor.flipVertical();
  }

  public imageCroppedHandler(event: ImageCroppedEvent) {
    this.croppedImageHeight = event.height;
    this.croppedImageWidth = event.width;
  }
  public async saveClickHandler(): Promise<void> {
    if (this.isMemeMode) {
      const base64 = createMem(
        this.imageToEditBase64,
        this.upText,
        this.downText,
        this.colorPicker
      );
      this.upText = this.downText = '';
      this.memeSaved = true;
      this.saveClickedEvent.emit({
        originalImageUrl: this.imageToEditBlobId,
        editedImageBase64: this.imageService.copyExif(
          this.imageToEditBase64,
          base64
        )
      });
    } else if (this.isFiltersMode) {
      this.saveClickedEvent.emit({
        originalImageUrl: this.imageToEditBlobId,
        editedImageBase64: this.imageUpdated
      });
    } else {
      const event: ImageCroppedEvent = await this.imageEditor.crop();
      this.saveClickedEvent.emit({
        originalImageUrl: this.imageToEditBlobId,
        editedImageBase64: this.imageService.copyExif(
          this.imageToEditBase64,
          event.base64
        )
      });
    }
  }

  public cancelClickHandler() {
    this.cancelClickedEvent.emit();
    this.isShown = false;
  }

  resetClickHandler() {
    this.resetClickedEvent.emit();
  }

  enableMeme() {
    this.isMemeMode = !this.isMemeMode;
  }

  disableMeme() {
    this.isMemeMode = false;
  }

  enableFilters() {
    this.disableMeme();
    this.disableAll();
    this.isFiltersMode = !this.isFiltersMode;
  }

  setFilter(filter: string) {
    this.filter = filter;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = this.imageToEditBase64;
    image.onload = () => {
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      if (filter !== '') {
        const newImageData = pixelsJS.filterImgData(imageData, filter);
        ctx.putImageData(newImageData, 0, 0);
      }
      const updatedImage = canvas.toDataURL(
        `image/${this.photoToEdit.name.split('.').pop()}`
      );
      this.updatePictureExplosure(updatedImage);
    };
  }

  setFilterForThumbnail() {
    this.filters.forEach(item => {
      const image = document.getElementById(
        this.filters.indexOf(item).toString()
      ) as HTMLImageElement;
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      img.src = this.thumbnailUpdatedBase64;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const newImageData = pixelsJS.filterImgData(imageData, item);
        ctx.putImageData(newImageData, 0, 0);
        image.src = canvas.toDataURL(
          `image/${this.photoToEdit.name.split('.').pop()}`
        );
      };
    });
    const points = Array.from(
      document.getElementsByClassName('ng5-slider-pointer')
    );
    const slides = Array.from(document.getElementsByClassName('ng5-slider'));
    const sliders = points.concat(slides);
    sliders.forEach(element => {
      const el = element as HTMLElement;
      el.style.backgroundColor = '#00B89C';
    });
  }

  setBrightness(changeContext) {
    this.brightness = changeContext.value;
    this.setFilter(this.filter);
  }

  setContrast(changeContext) {
    this.contrast = changeContext.value;
    this.setFilter(this.filter);
  }

  updatePictureExplosure(imageBase64) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageBase64;
    image.onload = () => {
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const filtered = ImageFilters.BrightnessContrastPhotoshop(
        imageData,
        this.brightness,
        this.contrast
      );
      ctx.putImageData(filtered, 0, 0);
      const imageUrl = canvas.toDataURL(
        `image/${this.photoToEdit.name.split('.').pop()}`
      );
      this.imageUpdated = imageUrl;
      this.imageUpdatedBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(
        imageUrl
      );
    };
  }

  displayRotateAndCrop() {
    this.disableAll();
    this.showRotateAndCrop = true;
    this.disableMeme();
  }

  displayFilters() {
    this.disableAll();
    this.showRotateAndCrop = false;
    this.isFiltersMode = true;
    this.disableMeme();
  }

  displayFlip() {
    this.disableAll();
    this.disableMeme();
  }

  displayMeme() {
    this.disableAll();
    this.showMeme = true;
    this.enableMeme();
  }

  disableAll() {
    this.showRotateAndCrop = false;
    this.showMeme = false;
    this.isFiltersMode = false;
  }
}
