import { TestBed } from '@angular/core/testing';

import { SharingServiceService } from './sharing.service';

describe('SharingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharingServiceService = TestBed.get(SharingServiceService);
    expect(service).toBeTruthy();
  });
});
