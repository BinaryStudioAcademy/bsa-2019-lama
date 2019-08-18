import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAlbumCoverComponent } from './choose-album-cover.component';

describe('ChooseAlbumCoverComponent', () => {
  let component: ChooseAlbumCoverComponent;
  let fixture: ComponentFixture<ChooseAlbumCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAlbumCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAlbumCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
