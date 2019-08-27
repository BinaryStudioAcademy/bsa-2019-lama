import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatesModalComponent } from './duplicates-modal.component';

describe('DuplicatesModalComponent', () => {
  let component: DuplicatesModalComponent;
  let fixture: ComponentFixture<DuplicatesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
