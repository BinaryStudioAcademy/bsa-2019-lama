import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.sass']
})
export class CreateAlbumModalComponent implements OnInit {


  @Input()
  public isShown: boolean;
  constructor() {
    this.isShown = true;
   }

  ngOnInit() {
  }

  urls = [];
  onSelectFile(event) 
  {

    if (event.target.files && event.target.files[0]) {
        let filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                let reader = new FileReader();

                reader.onload = (event:any) => {
                  console.log(event.target.result);
                   this.urls.push(event.target.result); 
                }
                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }

  toggleModal()
  {
    this.isShown = false;
  }
}
