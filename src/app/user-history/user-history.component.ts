import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductUsage } from 'src/models/product-usage/product-usage.dto';
import { ProductUsageService } from 'src/services/product-usage.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
})
export class UserHistoryComponent implements OnInit {
  faSearch = faSearch as IconProp;

  lastProductUses: ProductUsage[] = [];

  isLoading = false;
  searchText = '';

  constructor(
    private productUsageService: ProductUsageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
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
