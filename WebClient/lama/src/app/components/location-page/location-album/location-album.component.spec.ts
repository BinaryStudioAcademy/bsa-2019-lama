import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAlbumComponent } from './location-album.component';

describe('LocationAlbumComponent', () => {
  let component: LocationAlbumComponent;
  let fixture: ComponentFixture<LocationAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
