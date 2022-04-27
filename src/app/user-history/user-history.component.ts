import { Component, OnInit } from '@angular/core';
import { ProductUsage } from 'src/models/product-usage/product-usage';
import { ProductUsageService } from 'src/services/product-usage.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {

  lastProductUses?: ProductUsage[];

  isLoading = false;

  constructor(
    private productUsageService: ProductUsageService,
    private userService: UserService) { }

  ngOnInit(): void {
    let user = this.userService.getUser();

    this.isLoading = true;

    this.productUsageService
      .getLastUsesByResearcher(user.id)
      .subscribe((lastProductUses: ProductUsage[]) => {
        this.lastProductUses = lastProductUses;
        this.isLoading = false;
      });
  }

}
