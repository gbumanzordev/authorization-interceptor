import { TestBed } from '@angular/core/testing';

import { AuthRequestsService } from './auth-requests.service';

describe('AuthRequestsService', () => {
  let service: AuthRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
