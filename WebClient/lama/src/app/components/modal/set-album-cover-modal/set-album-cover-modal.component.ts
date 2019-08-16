import { Component, OnInit, Input, Output, EventEmitter, DoCheck, ViewChildren, QueryList } from '@angular/core';
import { ViewAlbum } from 'src/app/models/Album/ViewAlbum';
import { PhotoRaw, Photo } from 'src/app/models';
import { ChooseAlbumCoverComponent } from '../../choose-album-cover/choose-album-cover.component';
import { AlbumService } from 'src/app/services/album.service';
import { UpdateAlbum } from 'src/app/models/Album/updatedAlbum';

@Component({
  selector: 'app-set-album-cover-modal',
  templateUrl: './set-album-cover-modal.component.html',
  styleUrls: ['./set-album-cover-modal.component.sass']
})


export class SetAlbumCoverModalComponent implements OnInit {

  @ViewChildren('albumPhoto') components: QueryList<ChooseAlbumCoverComponent>;

  @Input() receivedAlbum: ViewAlbum;
  @Output() Change = new EventEmitter<PhotoRaw>();

  @Input() isShown: boolean;
  selectedPhoto?: PhotoRaw = null;
  updatedAlbum: UpdateAlbum = {} as UpdateAlbum;

  constructor(private albumService: AlbumService) {
    this.isShown = true;
   }

  ngOnInit() {
    this.receivedAlbum.photoAlbums.forEach(x => console.log(x.blobId));
  }

  clickPerformed(eventArgs: PhotoRaw) {
    this.Change.emit(eventArgs);
  }

  setSelectedCover() {
    if (this.selectedPhoto !== null) {
        this.updatedAlbum.coverId = this.selectedPhoto.id;
        this.updatedAlbum.id = this.receivedAlbum.id;
        this.Change.emit(this.selectedPhoto);
        this.albumService.updateAlbumCover(this.updatedAlbum)
          .subscribe(updatedAlbum => this.receivedAlbum.photo.id = updatedAlbum.coverId);
    }
    this.isShown = false;
  }

  toggleModal() {
    this.isShown = false;
  }

  receiveSelected(event: PhotoRaw) {
    this.components.forEach(albumCoverComponent => {
      if (albumCoverComponent.cover.id !== event.id && albumCoverComponent.isSelected) {
        albumCoverComponent.isSelected = false;
      }
    });
    if (this.selectedPhoto !== null && this.selectedPhoto.id === event.id) {
      this.selectedPhoto = null;
    } else { this.selectedPhoto = event; }
  }
}