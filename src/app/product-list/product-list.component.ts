import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleLeft,
  faReceipt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { GetProduct } from 'src/models/product/get-product.dto';
import { ProductService } from 'src/services/product.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  faAngleLeft = faAngleLeft as IconProp;
  faSearch = faSearch as IconProp;
  faReceipt = faReceipt as IconProp;

  products: GetProduct[] = [];
  searchText: string = '';
  page = 1;

  isLoading = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getAll(this.page).subscribe(
      (products: GetProduct[]) => {
        this.products = products;
        this.isLoading = false;
      },
      (err: any) => {
        let errorMessage;
        if (err.status == 500) {
          errorMessage = 'Something bad happened.';
        } else {
          errorMessage = err.statusText;
        }

        this.isLoading = false;
        this.toastService.show(errorMessage, 'Error', true);
      }
    );
  }

  onScroll() {
    console.log("scrolled page: ", this.page);
    this.isLoading = true;
    this.productService.getAll(++this.page).subscribe(
      (products: GetProduct[]) => {
        this.products.push(...products);
        this.isLoading = false;
      },
      (err: any) => {
        let errorMessage;
        if (err.status == 500) {
          errorMessage = 'Something bad happened.';
        } else {
          errorMessage = err.statusText;
        }

        this.isLoading = false;
        this.toastService.show(errorMessage, 'Error', true);
      }
    );
  }
}
