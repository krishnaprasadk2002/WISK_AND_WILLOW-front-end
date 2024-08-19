import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminLogGuard } from './admin-log.guard';

describe('adminLogGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminLogGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
