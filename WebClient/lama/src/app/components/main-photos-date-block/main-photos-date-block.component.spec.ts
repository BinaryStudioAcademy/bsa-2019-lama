import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPhotosDateBlockComponent } from './main-photos-date-block.component';

describe('MainPhotosDateBlockComponent', () => {
  let component: MainPhotosDateBlockComponent;
  let fixture: ComponentFixture<MainPhotosDateBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPhotosDateBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPhotosDateBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
