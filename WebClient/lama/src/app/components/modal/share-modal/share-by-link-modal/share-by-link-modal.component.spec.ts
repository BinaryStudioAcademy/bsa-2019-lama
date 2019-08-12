import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareByLinkModalComponent } from './share-by-link-modal.component';


describe('ShareByLinkModalComponent', () => {
  let component: ShareByLinkModalComponent;
  let fixture: ComponentFixture<ShareByLinkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareByLinkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareByLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
