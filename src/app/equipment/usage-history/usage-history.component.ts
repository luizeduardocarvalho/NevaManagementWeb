import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUsageHistory } from 'src/models/equipment-usage/usage-history';
import { EquipmentUsageService } from 'src/services/equipment-usage.service';

@Component({
  selector: 'app-usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss'],
})
export class UsageHistoryComponent implements OnInit {
  history: IUsageHistory[] = [];
  equipmentId = 0;
  isLoading = false;
  page = 1;

  constructor(
    private equipmentUsageService: EquipmentUsageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.equipmentId = param['id'];
    });

    this.equipmentUsageService
      .getEquipmentUsage(this.equipmentId, this.page)
      .subscribe((history: IUsageHistory[]) => {
        this.history = history;
        console.log(history);
      });
  }

  onScroll() {
    this.isLoading = true;
    this.equipmentUsageService
    .getEquipmentUsage(++this.page, this.equipmentId)
    .subscribe((history: IUsageHistory[]) => {
      this.history.push(...history);
      this.isLoading = false;
    },
    (err: any) => this.isLoading = false);
  }
}
