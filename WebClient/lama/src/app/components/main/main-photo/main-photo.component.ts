import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
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
  @Input ('_id') id: number = -1;
  @Output() onClick = new EventEmitter<PhotoRaw>();

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
