import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPhotosContainerComponent } from './main-photos-container.component';

describe('MainPhotosContainerComponent', () => {
  let component: MainPhotosContainerComponent;
  let fixture: ComponentFixture<MainPhotosContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPhotosContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPhotosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
