import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddProduct } from 'src/models/product/add-product';
import { IAddQuantity } from 'src/models/product/add-quantity';
import { EditProduct } from 'src/models/product/edit-product.dto';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { GetProduct } from 'src/models/product/get-product.dto';
import { UseProduct } from 'src/models/product/use-product.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.baseUrl + 'Product/';

  constructor(private http: HttpClient) {}

  getAll(page: number): Observable<GetProduct[]> {
    return this.http.get<GetProduct[]>(this.url + 'GetAll', {
      params: { page },
    });
  }

  create(product: IAddProduct): Observable<any> {
    return this.http.post<IAddProduct>(this.url + 'Create', product);
  }

  getProductById(id: number): Observable<GetProduct> {
    return this.http.get<GetProduct>(this.url + 'GetProductById', {
      params: { id },
    });
  }

  getDetailedProductById(id: number): Observable<IGetDetailedProduct> {
    return this.http.get<IGetDetailedProduct>(
      this.url + 'GetDetailedProductById',
      {
        params: { id },
      }
    );
  }

  addProductQuantity(addQuantityDto: IAddQuantity): Observable<any> {
    return this.http.patch<any>(this.url + 'AddQuantity', addQuantityDto, {
      observe: 'response',
    });
  }

  useProduct(useProduct: UseProduct): Observable<HttpResponse<UseProduct>> {
    return this.http.patch<UseProduct>(this.url + 'UseProduct', useProduct, {
      observe: 'response',
    });
  }

  editProduct(editProduct: EditProduct): Observable<any> {
    return this.http.patch(this.url + 'EditProduct', editProduct, {
      observe: 'response',
    });
  }

  getLowInStockProduct(): Observable<IGetDetailedProduct[]> {
    return this.http.get<IGetDetailedProduct[]>(
      this.url + 'GetLowInStockProducts'
    );
  }
}
