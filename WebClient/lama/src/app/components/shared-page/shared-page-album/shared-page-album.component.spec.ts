import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPageAlbumComponent } from './shared-page-album.component';

describe('SharedPageAlbumComponent', () => {
  let component: SharedPageAlbumComponent;
  let fixture: ComponentFixture<SharedPageAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPageAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPageAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
