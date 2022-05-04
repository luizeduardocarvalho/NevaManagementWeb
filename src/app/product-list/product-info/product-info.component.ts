import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { ProductService } from 'src/services/product.service';

@Component({
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {

  isLoading = false;

  productId = 0;
  product?: GetDetailedProduct;
  isExpired = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

    this.isLoading = true;
    
    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: GetDetailedProduct) => {
        this.product = product;
        this.isExpired = new Date(product.expirationDate) <= new Date();
        
        if(product.formula != null) {
          this.product.formula = '(' + product.formula + ')';
        }

        this.isLoading = false;
      }
    );
  }

}
