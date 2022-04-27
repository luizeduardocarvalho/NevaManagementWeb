import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentComponent } from './equipment/equipment.component';

const routes: Routes = [
  { 
    path: '',
    component: EquipmentComponent,
    children: [
      { path: '', component: EquipmentListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
