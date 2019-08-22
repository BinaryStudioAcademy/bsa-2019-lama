import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnInit
} from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState } from 'src/app/models/Photo/photoRawState';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Favorite } from 'src/app/models/favorite';
import { FileService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass'],
  providers: [FavoriteService]
})
export class MainPhotoComponent implements OnChanges, OnInit {
  public isFavorite = false;
  // properties
  @Input('_photo') photo: PhotoRaw;
  imageUrl: string;
  isSelected = false;
  @Input('_id') id = -1;
  @Output() Click = new EventEmitter<PhotoRaw>();
  @Output() Select = new EventEmitter<PhotoRawState>();
  private userId: number;

  // constructors
  constructor(
    private favoriteService: FavoriteService,
    private fileService: FileService,
    private notifier: NotifierService
  ) {}
  ngOnInit() {
    this.fileService
      .getPhoto(this.photo.blob256Id)
      .subscribe(url => (this.imageUrl = url));
  }

  ngOnChanges() {
    this.checkFavorite();
    this.userId = parseInt(localStorage.getItem('userId'), 10);
  }

  checkFavorite() {
    if (this.id === -1) {
      this.isFavorite = false;
    } else {
      this.isFavorite = true;
    }
  }

  changeFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  checkCorrectReturn(id: number) {
    this.changeFavorite();
    this.id = id;
    if (id === -1) {
      this.changeFavorite();
    }
    if (this.photo.id === parseInt(localStorage.getItem('favoriteCover'), 10)) {
      localStorage.removeItem('favoriteCover');
    }
  }

  // methods
  public clickPerformed() {
    this.Click.emit(this.photo);
  }

  public selectItem() {
    this.isSelected = !this.isSelected;
    this.Select.emit({ photo: this.photo, isSelected: this.isSelected });
  }
  public mark() {
    if (this.isFavorite) {
      this.favoriteService.deleteFavorite(this.userId, this.photo.id).subscribe(
        data => this.checkCorrectReturn(data),
        err => {
          this.changeFavorite();
          this.notifier.notify('error', 'Error');
        }
      );
    } else {
      const favorite: Favorite = new Favorite(this.photo.id, this.userId);
      this.favoriteService.createFavorite(favorite).subscribe(
        data => this.checkCorrectReturn(data),
        err => {
          this.changeFavorite();
          this.notifier.notify('error', 'Error loading');
        }
      );
    }
  }
}
