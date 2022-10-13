import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { EquipmentCardComponent } from './equipment-card/equipment-card.component';
import { EquipmentInfoComponent } from './equipment-info/equipment-info.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { UsageHistoryComponent } from './usage-history/usage-history.component';
import { UseEquipmentComponent } from './use-equipment/use-equipment.component';

const routes: Routes = [
  {
    path: '',
    component: EquipmentComponent,
    children: [
      { path: '', component: EquipmentListComponent },
      { path: 'add', component: AddEquipmentComponent },
      { path: ':id', component: EquipmentCardComponent },
      { path: ':id/use', component: UseEquipmentComponent },
      { path: ':id/history', component: UsageHistoryComponent },
      { path: ':id/info', component: EquipmentInfoComponent },
      { path: ':id/edit', component: EditEquipmentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule {}
