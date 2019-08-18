import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAlbumCoverModalComponent } from './set-album-cover-modal.component';

describe('SetAlbumCoverModalComponent', () => {
  let component: SetAlbumCoverModalComponent;
  let fixture: ComponentFixture<SetAlbumCoverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAlbumCoverModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAlbumCoverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
