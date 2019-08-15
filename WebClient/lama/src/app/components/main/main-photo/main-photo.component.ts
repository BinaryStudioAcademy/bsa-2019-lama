import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState} from 'src/app/models/Photo/photoRawState';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Favorite } from 'src/app/models/favorite';

@Component({
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass'],
  providers: [FavoriteService]
})
export class MainPhotoComponent implements OnInit {

  isFavorite:boolean = false;
  // properties
  @Input ('_photo') photo: PhotoRaw;
  isSelected: boolean = false;
  @Input ('_id') id: number = -1;
  @Output() onClick = new EventEmitter<PhotoRaw>();
  @Output() onSelect = new EventEmitter<PhotoRawState>();

  // constructors
  constructor(private _favoriteService: FavoriteService) {
   }

  ngOnInit() {
    if(this.id==-1)
      this.isFavorite = false;
    else 
      this.isFavorite = true;
  }

  changeFavorite(){
    this.isFavorite = !this.isFavorite;
  }

  checkCorrectReturn(id:number){
    this.changeFavorite();
    this.id = id;
    if(id == -1)
      this.changeFavorite();
  }

  // methods
  public clickPerformed(): void
  {
    this.onClick.emit(this.photo);
  }

  public selectItem(): void 
  {
    this.isSelected = !this.isSelected;
    this.onSelect.emit({photo: this.photo, isSelected: this.isSelected});
  }
  public mark(){
    if(this.isFavorite){
      this._favoriteService.deleteFavorite(this.photo.userId, this.photo.id).subscribe(
        data => this.checkCorrectReturn(data),
        err => this.changeFavorite()
        )
      }
    else{
      let favorite:Favorite = new Favorite(this.photo.id, this.photo.userId);
      this._favoriteService.createFavorite(favorite).subscribe(
        data => this.checkCorrectReturn(data),
        err => this.changeFavorite()
      );
    }
  }
}
