import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarDto } from 'src/models/equipment-usage/calendar.dto';
import { GetDetailedEquipmentDto } from 'src/models/equipment/get-detailed-equipment.dto';
import { EquipmentUsageService } from 'src/services/equipment-usage.service';
import { EquipmentService } from 'src/services/equipment.service';

@Component({
  templateUrl: './equipment-card.component.html',
  styleUrls: ['./equipment-card.component.scss'],
})
export class EquipmentCardComponent implements OnInit {
  isLoading = false;
  equipmentId = 0;

  equipment?: GetDetailedEquipmentDto;
  calendar: CalendarDto[] = [];

  constructor(
    private equipmentUsageService: EquipmentUsageService,
    private route: ActivatedRoute,
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: GetDetailedEquipmentDto) => {
        this.equipment = equipment;

        if (this.equipment.description.length > 40) {
          this.equipment.description = this.equipment.description
            .substring(0, 40)
            .concat('...');
        }
      });

    this.equipmentUsageService
      .getEquipmentUsageCalendar(this.equipmentId)
      .subscribe((data: CalendarDto[]) => {
        this.calendar = data;
      });
  }
}
