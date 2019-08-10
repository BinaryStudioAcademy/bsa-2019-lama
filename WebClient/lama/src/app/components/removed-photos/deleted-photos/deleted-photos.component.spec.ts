import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedPhotosComponent } from './deleted-photos.component';

describe('DeletedPhotosComponent', () => {
  let component: DeletedPhotosComponent;
  let fixture: ComponentFixture<DeletedPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
