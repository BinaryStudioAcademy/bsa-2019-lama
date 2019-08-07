import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAlbumsContainerComponent } from './main-albums-container.component';

describe('MainAlbumsContainerComponent', () => {
  let component: MainAlbumsContainerComponent;
  let fixture: ComponentFixture<MainAlbumsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAlbumsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAlbumsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
