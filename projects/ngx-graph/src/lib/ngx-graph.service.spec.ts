import { TestBed } from '@angular/core/testing';

import { NgxGraphService } from './ngx-graph.service';

describe('NgxGraphService', () => {
  let service: NgxGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
