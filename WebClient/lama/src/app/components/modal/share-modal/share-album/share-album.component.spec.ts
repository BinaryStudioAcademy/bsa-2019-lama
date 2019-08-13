import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAlbumComponent } from './share-album.component';

describe('ShareAlbumComponent', () => {
  let component: ShareAlbumComponent;
  let fixture: ComponentFixture<ShareAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
