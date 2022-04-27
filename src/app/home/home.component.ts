import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faAngleRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { GetLastProduct } from 'src/models/product-usage/get-last-product.dto';
import { ProductUsageService } from 'src/services/product-usage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faSearch = faSearch as IconProp;
  faAngleRight = faAngleRight as IconProp;
  faPen = faPen as IconProp;

  product?: GetLastProduct;

  isLoading = false;

  constructor(
    private productUsageService: ProductUsageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    let userId = this.userService.getUser().id;
    this.productUsageService
      .getLastUsedProductByResearcher(userId)
      .subscribe((product: GetLastProduct) => {
        this.product = product;
        this.isLoading = false;
      },
    );
  }
}
