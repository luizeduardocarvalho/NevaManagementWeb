import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrganismComponent } from './add-organism/add-organism.component';
import { EditOrganismComponent } from './edit-organism/edit-organism.component';
import { OrganismListComponent } from './organism-list/organism-list.component';
import { OrganismComponent } from './organism.component';

const routes: Routes = [
  { 
    path: '', 
    component: OrganismComponent, 
    children: [
      { path: '', component: OrganismListComponent },
      { path: ':id/edit', component: EditOrganismComponent },
      { path: 'add', component: AddOrganismComponent }
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganismRoutingModule { }
