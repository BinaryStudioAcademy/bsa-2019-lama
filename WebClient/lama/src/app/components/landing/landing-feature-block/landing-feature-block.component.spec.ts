import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingFeatureBlockComponent } from './landing-feature-block.component';

describe('LandingFeatureBlockComponent', () => {
  let component: LandingFeatureBlockComponent;
  let fixture: ComponentFixture<LandingFeatureBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingFeatureBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingFeatureBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
