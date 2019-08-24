import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhotosToAlbumModalComponent } from './add-photos-to-album-modal.component';

describe('AddPhotosToAlbumModalComponent', () => {
  let component: AddPhotosToAlbumModalComponent;
  let fixture: ComponentFixture<AddPhotosToAlbumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhotosToAlbumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhotosToAlbumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
