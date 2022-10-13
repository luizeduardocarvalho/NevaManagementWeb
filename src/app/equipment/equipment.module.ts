import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { EquipmentCardComponent } from './equipment-card/equipment-card.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { EquipmentComponent } from './equipment/equipment.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { EquipmentInfoComponent } from './equipment-info/equipment-info.component';
import { UseEquipmentComponent } from './use-equipment/use-equipment.component';
import { UsageHistoryComponent } from './usage-history/usage-history.component';


@NgModule({
  declarations: [
    EquipmentComponent,
    EquipmentListComponent,
    EquipmentCardComponent,
    EditEquipmentComponent,
    AddEquipmentComponent,
    EquipmentInfoComponent,
    UseEquipmentComponent,
    UsageHistoryComponent
  ],
  imports: [
    EquipmentRoutingModule,
    SharedModule
  ]
})
export class EquipmentModule { }
