import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAlbumModalComponent } from './select-album-modal.component';

describe('SelectAlbumModalComponent', () => {
  let component: SelectAlbumModalComponent;
  let fixture: ComponentFixture<SelectAlbumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAlbumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAlbumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
