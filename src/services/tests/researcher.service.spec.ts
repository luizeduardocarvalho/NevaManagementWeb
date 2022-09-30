import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { GetSimpleResearcher } from 'src/models/researcher/get-simple-researcher.dto';
import { ResearcherService } from '../researcher.service';
import { TokenService } from '../token.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let tokenServiceSpy: jasmine.SpyObj<TokenService>;
let service: ResearcherService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  tokenServiceSpy = jasmine.createSpyObj('TokenService', ['get']);
  service = new ResearcherService(httpClientSpy, tokenServiceSpy);
});

describe('ResearcherService', () => {
  it('#getResearchers should return list', (done: DoneFn) => {
    const expectedResearchers: GetSimpleResearcher[] = [
      { id: 1, name: 'Researcher 1' },
      { id: 2, name: 'Researcher 2' },
    ];

    httpClientSpy.get.and.returnValue(of(expectedResearchers));

    service.getResearchers().subscribe({
      next: (researchers) => {
        expect(researchers)
          .withContext('expected researchers')
          .toEqual(expectedResearchers);
        done();
      },
      error: done.fail,
    });
    
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});
