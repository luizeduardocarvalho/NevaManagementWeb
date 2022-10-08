import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { GetLastUseByProduct } from 'src/models/product-usage/get-last-use-by-product.dto';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { IUser } from 'src/models/user/user.dto';
import { ProductUsageService } from 'src/services/product-usage.service';
import { ProductService } from 'src/services/product.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  faAngleLeft = faAngleLeft as IconProp;
  product?: IGetDetailedProduct;
  lastUses: GetLastUseByProduct[] = [];
  productId: number = 0;
  user?: IUser;

  isLoading = false;
  isCardLoading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private productUsageService: ProductUsageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.isLoading = true;

    this.user = this.userService.getUser();

    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: IGetDetailedProduct) => {
        this.product = product;

        this.productUsageService
          .getLastUsesByProduct(this.productId)
          .subscribe((lastUses: GetLastUseByProduct[]) => {
            this.lastUses = lastUses;

            this.isLoading = false;
          });
      });
  }
}
