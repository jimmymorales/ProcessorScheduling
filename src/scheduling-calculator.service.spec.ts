import { TestBed } from '@angular/core/testing';

import { SchedulingParametersStore } from './scheduling-parameters-store.service';

describe('SchedulingCalculatorService', () => {
  let service: SchedulingParametersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulingParametersStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
