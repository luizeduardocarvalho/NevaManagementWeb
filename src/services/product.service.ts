import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetProduct } from 'src/models/product/get-product.dto';
import { baseUrl } from 'settings';
import { CreateProductDto } from 'src/models/product/create-product-dto';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { AddQuantity } from 'src/models/product/add-quantity.dto';
import { UseProduct } from 'src/models/product/use-product.dto';
import { EditProduct } from 'src/models/product/edit-product.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = baseUrl + 'Product/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getAll(): Observable<GetProduct[]> {
    return this.http.get<GetProduct[]>(this.url + 'GetAll', {
      headers: this.httpOptions.headers,
    });
  }

  create(product: CreateProductDto): Observable<unknown> {
    return this.http.post<boolean>(this.url + 'Create', product, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  getProductById(id: number): Observable<GetProduct> {
    return this.http.get<GetProduct>(this.url + 'GetProductById', {
      params: { id: id },
      headers: this.httpOptions.headers,
    });
  }

  getDetailedProductById(id: number): Observable<IGetDetailedProduct> {
    return this.http.get<IGetDetailedProduct>(
      this.url + 'IGetDetailedProductById',
      {
        params: { id: id },
        headers: this.httpOptions.headers,
      }
    );
  }

  addProductQuantity(addQuantityDto: AddQuantity): Observable<any> {
    return this.http.patch<any>(this.url + 'AddQuantity', addQuantityDto, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  useProduct(useProduct: UseProduct): Observable<HttpResponse<UseProduct>> {
    return this.http.patch<UseProduct>(this.url + 'UseProduct', useProduct, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  editProduct(editProduct: EditProduct): Observable<any> {
    return this.http.patch(this.url + 'EditProduct', editProduct, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  getLowInStockProduct(): Observable<IGetDetailedProduct[]> {
    return this.http.get<IGetDetailedProduct[]>(
      this.url + 'GetLowInStockProducts'
    );
  }
}
