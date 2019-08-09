import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPageHeaderComponent } from './shared-page-header.component';

describe('SharedPageHeaderComponent', () => {
  let component: SharedPageHeaderComponent;
  let fixture: ComponentFixture<SharedPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
