import { Directive, Output, EventEmitter, HostListener, HostBinding} from '@angular/core';
import {Photo} from '../models/Photo/photo';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[fileDrop]'
})
export class FileUploadDirective {

  @Output() fileDropped = new EventEmitter<any>();
  constructor() { }

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.getElementsByTagName('body')[0].style.opacity = '0.8';
    this.background = '#9ecbec';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.getElementsByTagName('body')[0].style.opacity = '1';
    this.background = '#f5fcff';
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.getElementsByTagName('body')[0].style.opacity = '1';
    this.background = '#f5fcff';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}
