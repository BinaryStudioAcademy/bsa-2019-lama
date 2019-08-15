import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAlbumByEmailComponent } from './share-album-by-email.component';

describe('ShareAlbumByEmailComponent', () => {
  let component: ShareAlbumByEmailComponent;
  let fixture: ComponentFixture<ShareAlbumByEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAlbumByEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAlbumByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
