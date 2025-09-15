import { TestBed } from '@angular/core/testing';

import { ApiGateWayService } from './apiGateway.service';

describe('ApiService', () => {
  let service: ApiGateWayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGateWayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
