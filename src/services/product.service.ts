import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetProduct } from 'src/models/product/get-product.dto';
import { baseUrl } from 'settings';
import { CreateProductDto } from 'src/models/product/create-product-dto';
import { GetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { AddQuantity } from 'src/models/product/add-quantity.dto';
import { UseProduct } from 'src/models/product/use-product.dto';
import { EditProduct } from 'src/models/product/edit-product.dto';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		Authorization: 'my-auth-token'
	})
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  [x: string]: any;

  url = baseUrl + 'Product/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetProduct[]> {
    return this.http.get<GetProduct[]>(this.url + 'GetAll');
  }

  create(product: CreateProductDto): Observable<unknown> {
    return this.http.post<boolean>(this.url + 'Create', product, { observe: 'response' });
  }

  getProductById(id: number): Observable<GetProduct> {
    return this.http.get<GetProduct>(
      this.url + 'GetProductById',
      {
        params: { 'id': id }
      }
    );
  }

  getDetailedProductById(id: number): Observable<GetDetailedProduct> {
    return this.http.get<GetDetailedProduct>(
      this.url + 'GetDetailedProductById', 
      {
        params: { 'id': id }
      });
  }

  addProductQuantity(addQuantityDto: AddQuantity): Observable<any> {
    return this.http
      .patch<any>(this.url + 'AddQuantity', addQuantityDto, { observe: 'response' });
  }

  useProduct(useProduct: UseProduct): Observable<HttpResponse<UseProduct>> {
    return this.http
      .patch<UseProduct>(this.url + 'UseProduct', useProduct, { observe: 'response' });
  }

  editProduct(editProduct: EditProduct): Observable<any> {
    return this.http.patch(this.url + 'EditProduct', editProduct, { observe: 'response' });
  }
}
