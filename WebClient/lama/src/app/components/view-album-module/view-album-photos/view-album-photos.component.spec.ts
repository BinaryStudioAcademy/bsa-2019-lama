import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlbumPhotosComponent } from './view-album-photos.component';

describe('ViewAlbumPhotosComponent', () => {
  let component: ViewAlbumPhotosComponent;
  let fixture: ComponentFixture<ViewAlbumPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAlbumPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlbumPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
