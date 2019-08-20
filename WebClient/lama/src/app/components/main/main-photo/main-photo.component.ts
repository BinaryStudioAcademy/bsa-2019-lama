import { Component, Input, EventEmitter, Output, OnChanges, OnInit } from '@angular/core';

import { PhotoRaw } from 'src/app/models/Photo/photoRaw';
import { PhotoRawState} from 'src/app/models/Photo/photoRawState';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Favorite } from 'src/app/models/favorite';
import { FileService } from 'src/app/services';

@Component({
  selector: 'main-photo',
  templateUrl: './main-photo.component.html',
  styleUrls: ['./main-photo.component.sass'],
  providers: [FavoriteService]
})
export class MainPhotoComponent implements OnChanges, OnInit {

  public isFavorite: boolean = false;
  // properties
  @Input ('_photo') photo: PhotoRaw;
  imageUrl: string;
  isSelected: boolean = false;
  @Input ('_id') id: number = -1;
  @Output() onClick = new EventEmitter<PhotoRaw>();
  @Output() onSelect = new EventEmitter<PhotoRawState>();
  private userId: number;

  // constructors
  constructor(private _favoriteService: FavoriteService, private fileService: FileService) {
    
  }
  ngOnInit() {
    this.fileService.getPhoto(this.photo.blobId).subscribe((url) => this.imageUrl = url);
  }

   ngOnChanges(){
    this.checkFavorite();
    this.userId = parseInt(localStorage.getItem("userId"));
  }

  checkFavorite(){
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
    if(this.photo.id === parseInt(localStorage.getItem("favoriteCover")))
      localStorage.removeItem("favoriteCover"); 
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
      this._favoriteService.deleteFavorite(this.userId, this.photo.id).subscribe(
        data => this.checkCorrectReturn(data),
        err => this.changeFavorite()
        )
      }
    else{
      let favorite:Favorite = new Favorite(this.photo.id, this.userId);
      this._favoriteService.createFavorite(favorite).subscribe(
        data => this.checkCorrectReturn(data),
        err => this.changeFavorite()
      );
    }
  }
}
