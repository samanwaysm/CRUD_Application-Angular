import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isUserAuthGuard } from './is-user-auth.guard';

describe('isUserAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isUserAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
