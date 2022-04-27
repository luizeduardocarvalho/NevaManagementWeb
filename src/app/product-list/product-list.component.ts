import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetProduct } from 'src/models/product/get-product.dto';
import { ProductService } from 'src/services/product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  faAngleLeft = faAngleLeft as IconProp;
  faSearch = faSearch as IconProp;
  faPen = faPen as IconProp;

  products: GetProduct[] = [];
  searchText: string = '';

  isLoading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe((products: GetProduct[]) => {
      this.products = products;
      this.isLoading = false;
    });
  }
}
