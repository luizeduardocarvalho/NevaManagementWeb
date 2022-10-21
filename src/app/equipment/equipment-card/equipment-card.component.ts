import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CalendarDto } from 'src/models/equipment-usage/calendar.dto';
import { IGetDetailedEquipment } from 'src/models/equipment/get-detailed-equipment.dto';
import { EquipmentUsageService } from 'src/services/equipment-usage.service';
import { EquipmentService } from 'src/services/equipment.service';

@Component({
  templateUrl: './equipment-card.component.html',
  styleUrls: ['./equipment-card.component.scss'],
})
export class EquipmentCardComponent implements OnInit {
  isLoading = false;
  isCardLoading = false;
  equipmentId = 0;
  faPlus = faPlus as IconProp;

  equipment?: IGetDetailedEquipment;
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

    this.isCardLoading = true;
    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: IGetDetailedEquipment) => {
        this.equipment = equipment;

        if (this.equipment.description.length > 40) {
          this.equipment.description = this.equipment.description
            .substring(0, 40)
            .concat('...');
        }

        this.isCardLoading = false;
      });

    this.isLoading = true;
    this.equipmentUsageService
      .getEquipmentUsageCalendar(this.equipmentId)
      .subscribe(
        (data: CalendarDto[]) => {
          this.calendar = data;
          this.isLoading = false;
        },
        (err: any) => (this.isLoading = false)
      );
  }
}
