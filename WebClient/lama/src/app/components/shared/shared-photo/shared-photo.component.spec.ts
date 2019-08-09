import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPhotoComponent } from './shared-photo.component';

describe('SharedPhotoComponent', () => {
  let component: SharedPhotoComponent;
  let fixture: ComponentFixture<SharedPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
