import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faReceipt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetSimpleEquipmentDto } from 'src/models/equipment/get-simple-equipment.dto';
import { EquipmentService } from 'src/services/equipment.service';

@Component({
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
})
export class EquipmentListComponent implements OnInit {
  faSearch = faSearch as IconProp;
  faReceipt = faReceipt as IconProp;

  equipments: GetSimpleEquipmentDto[] = [];
  searchText = '';

  isLoading = false;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.equipmentService
      .getEquipments()
      .subscribe((equipments: GetSimpleEquipmentDto[]) => {
        this.equipments = equipments;
        this.isLoading = false;
      });
  }
}
