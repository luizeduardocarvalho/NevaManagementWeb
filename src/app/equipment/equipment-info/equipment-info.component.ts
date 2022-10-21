import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGetDetailedEquipment } from 'src/models/equipment/get-detailed-equipment.dto';
import { EquipmentService } from 'src/services/equipment.service';

@Component({
  templateUrl: './equipment-info.component.html',
  styleUrls: ['./equipment-info.component.scss'],
})
export class EquipmentInfoComponent implements OnInit {
  isLoading = false;
  equipmentId = 0;

  equipment?: IGetDetailedEquipment;
  calendar: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: IGetDetailedEquipment) => {
        this.equipment = equipment;
      });
  }
}
