import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLeftActionsSidebarComponent } from './main-left-actions-sidebar.component';

describe('MainLeftActionsSidebarComponent', () => {
  let component: MainLeftActionsSidebarComponent;
  let fixture: ComponentFixture<MainLeftActionsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLeftActionsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLeftActionsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
