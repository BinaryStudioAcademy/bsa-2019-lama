import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouseleComponentComponent } from './carousele-component.component';

describe('CarouseleComponentComponent', () => {
  let component: CarouseleComponentComponent;
  let fixture: ComponentFixture<CarouseleComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouseleComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouseleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
