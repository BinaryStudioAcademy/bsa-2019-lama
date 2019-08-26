import { TestBed } from '@angular/core/testing';

import { PhotodetailsService } from './photodetails.service';

describe('PhotodetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhotodetailsService = TestBed.get(PhotodetailsService);
    expect(service).toBeTruthy();
  });
});
