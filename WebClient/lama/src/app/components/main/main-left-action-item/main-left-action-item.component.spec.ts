import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLeftActionItemComponent } from './main-left-action-item.component';

describe('MainLeftActionItemComponent', () => {
  let component: MainLeftActionItemComponent;
  let fixture: ComponentFixture<MainLeftActionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLeftActionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLeftActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
