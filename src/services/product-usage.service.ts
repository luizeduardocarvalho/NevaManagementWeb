import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetLastProduct } from 'src/models/product-usage/get-last-product.dto';
import { GetLastUseByProduct } from 'src/models/product-usage/get-last-use-by-product.dto';
import { ProductUsage } from 'src/models/product-usage/product-usage.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductUsageService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = environment.baseUrl + 'ProductUsage/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getLastUsesByResearcher(researcherId: number): Observable<ProductUsage[]> {
    return this.http.get<ProductUsage[]>(this.url + 'GetLastUsesByResearcher', {
      params: { researcherId: researcherId },
      headers: this.httpOptions.headers,
    });
  }

  getLastUsedProductByResearcher(
    researcherId: number
  ): Observable<GetLastProduct> {
    return this.http.get<GetLastProduct>(
      this.url + 'GetLastUsedProductByResearcher',
      {
        params: { researcherId: researcherId },
        headers: this.httpOptions.headers,
      }
    );
  }

  getLastUsesByProduct(productId: number): Observable<GetLastUseByProduct[]> {
    return this.http.get<GetLastUseByProduct[]>(
      this.url + 'GetLastUsesByProduct',
      {
        params: { productId: productId },
        headers: this.httpOptions.headers,
      }
    );
  }
}
