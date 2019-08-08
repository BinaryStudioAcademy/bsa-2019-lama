import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseStoragePhotosComponent } from './choose-storage-photos.component';

describe('ChooseStoragePhotosComponent', () => {
  let component: ChooseStoragePhotosComponent;
  let fixture: ComponentFixture<ChooseStoragePhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseStoragePhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseStoragePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
