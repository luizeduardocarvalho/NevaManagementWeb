import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { baseUrl } from 'settings';
import { GetLastProduct } from "src/models/product-usage/get-last-product.dto";
import { GetLastUseByProduct } from "src/models/product-usage/get-last-use-by-product.dto";
import { ProductUsage } from "src/models/product-usage/product-usage.dto";

@Injectable({
    providedIn: 'root'
})
export class ProductUsageService {
    url = baseUrl + 'ProductUsage/';

    constructor(private http: HttpClient) { }

    getLastUsesByResearcher(researcherId: number): Observable<ProductUsage[]> {
        return this.http.get<ProductUsage[]>(
            this.url + 'GetLastUsesByResearcher',
            {
                params: { 'researcherId': researcherId }
            }
        );
    }

    getLastUsedProductByResearcher(researcherId: number): Observable<GetLastProduct> {
        return this.http.get<GetLastProduct>(
            this.url + 'GetLastUsedProductByResearcher',
            {
                params: { 'researcherId': researcherId }
            }
        );
    }

    getLastUsesByProduct(productId: number): Observable<GetLastUseByProduct[]> {
        return this.http.get<GetLastUseByProduct[]>(
            this.url + 'GetLastUsesByProduct',
            {
                params: { 'productId': productId }
            }
        );
    }
}