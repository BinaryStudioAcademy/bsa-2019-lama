import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangingFooterComponent } from './langing-footer.component';

describe('LangingFooterComponent', () => {
  let component: LangingFooterComponent;
  let fixture: ComponentFixture<LangingFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangingFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
