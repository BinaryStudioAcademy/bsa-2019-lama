import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBottomLoginComponent } from './landing-bottom-login.component';

describe('LandingBottomLoginComponent', () => {
  let component: LandingBottomLoginComponent;
  let fixture: ComponentFixture<LandingBottomLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingBottomLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingBottomLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
