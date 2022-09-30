import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { GetLastProduct } from 'src/models/product-usage/get-last-product.dto';
import { GetLastUseByProduct } from 'src/models/product-usage/get-last-use-by-product.dto';
import { ProductUsageService } from '../product-usage.service';
import { TokenService } from '../token.service';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let tokenServiceSpy: jasmine.SpyObj<TokenService>;
let service: ProductUsageService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  tokenServiceSpy = jasmine.createSpyObj('TokenService', ['get']);
  service = new ProductUsageService(httpClientSpy, tokenServiceSpy);
});

describe('ProductUsageService', () => {
  it('#getLastUsedProductByResearcher should return single GetLastProduct', (done: DoneFn) => {
    const expectedLastProduct = new GetLastProduct(
      1,
      'Product',
      'Location',
      1,
      'Unit'
    );

    httpClientSpy.get.and.returnValue(of(expectedLastProduct));

    service.getLastUsedProductByResearcher(1).subscribe({
      next: (lastProduct) => {
        expect(lastProduct)
          .withContext('expected last product')
          .toEqual(lastProduct);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('#getLastUsesByProduct should return list', (done: DoneFn) => {
    const getLastUsesByProduct: GetLastUseByProduct[] = [
        new GetLastUseByProduct('Researcher', new Date(), 1, 'Unit'),
        new GetLastUseByProduct('Researcher 2', new Date(), 1, 'Unit')
    ];

    httpClientSpy.get.and.returnValue(of(getLastUsesByProduct));

    service.getLastUsesByProduct(1).subscribe({
      next: (lastUses) => {
        expect(lastUses)
          .withContext('expected last uses')
          .toEqual(lastUses);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});
