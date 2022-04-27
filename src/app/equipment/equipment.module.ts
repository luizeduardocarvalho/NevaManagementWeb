import { NgModule } from '@angular/core';

import { EquipmentRoutingModule } from './equipment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EquipmentComponent } from './equipment/equipment.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';


@NgModule({
  declarations: [
    EquipmentComponent,
    EquipmentListComponent
  ],
  imports: [
    EquipmentRoutingModule,
    SharedModule
  ]
})
export class EquipmentModule { }
