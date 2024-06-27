import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DespachoService } from './despacho.service';

describe('DespachoService', () => {
  let service: DespachoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Añadir esto
      providers: [DespachoService]
    });
    service = TestBed.inject(DespachoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
