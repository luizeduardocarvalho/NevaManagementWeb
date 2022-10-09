import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleRight,
  faPen,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { IGetContainersOrderedByTransferDate } from 'src/models/container/get-containers-ordered-by-transfer-date';
import { GetLastProduct } from 'src/models/product-usage/get-last-product.dto';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { ContainerService } from 'src/services/container.service';
import { ProductUsageService } from 'src/services/product-usage.service';
import { ProductService } from 'src/services/product.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  faSearch = faSearch as IconProp;
  faAngleRight = faAngleRight as IconProp;
  faPen = faPen as IconProp;

  isLoadingNextTransfers = false;
  isLoadingProductCard = false;
  isLoadingLowInStock = false;

  product?: GetLastProduct;
  lowInStockProducts: IGetDetailedProduct[] = [];
  containers: IGetContainersOrderedByTransferDate[] = [];

  constructor(
    private productUsageService: ProductUsageService,
    private productService: ProductService,
    private userService: UserService,
    private containerService: ContainerService
  ) {}

  ngOnInit(): void {
    let userId = this.userService.getUser().id;

    this.isLoadingProductCard = true;
    this.productUsageService
      .getLastUsedProductByResearcher(userId)
      .subscribe((product: GetLastProduct) => {
        this.product = product;
        this.isLoadingProductCard = false;
      });

    this.isLoadingNextTransfers = true;
    this.containerService
      .getContainersOrderedByTransferDate()
      .subscribe((containers: IGetContainersOrderedByTransferDate[]) => {
        this.containers = containers.slice(0, 2);
        this.isLoadingNextTransfers = false;
      });

    this.isLoadingLowInStock = true;
    this.productService
      .getLowInStockProduct()
      .subscribe((products: IGetDetailedProduct[]) => {
        this.lowInStockProducts = products;
        this.isLoadingLowInStock = false;
      });
  }
}
