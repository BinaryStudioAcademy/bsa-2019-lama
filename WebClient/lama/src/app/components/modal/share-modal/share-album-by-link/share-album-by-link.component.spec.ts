import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAlbumByLinkComponent } from './share-album-by-link.component';

describe('ShareAlbumByLinkComponent', () => {
  let component: ShareAlbumByLinkComponent;
  let fixture: ComponentFixture<ShareAlbumByLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAlbumByLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAlbumByLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
