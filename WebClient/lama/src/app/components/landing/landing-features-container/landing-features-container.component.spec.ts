import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingFeaturesContainerComponent } from './landing-features-container.component';

describe('LandingFeaturesContainerComponent', () => {
  let component: LandingFeaturesContainerComponent;
  let fixture: ComponentFixture<LandingFeaturesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingFeaturesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingFeaturesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
