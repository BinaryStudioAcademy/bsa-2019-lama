import { TestBed, async, inject } from '@angular/core/testing';

import { UnsaveEditGuard } from './unsave-edit.guard';

describe('UnsaveEditGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsaveEditGuard]
    });
  });

  it('should ...', inject([UnsaveEditGuard], (guard: UnsaveEditGuard) => {
    expect(guard).toBeTruthy();
  }));
});
