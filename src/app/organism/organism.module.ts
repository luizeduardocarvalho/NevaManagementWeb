import { NgModule } from '@angular/core';

import { OrganismRoutingModule } from './organism-routing.module';
import { SharedModule } from '../shared/shared.module';

import { OrganismComponent } from './organism.component';
import { OrganismListComponent } from './organism-list/organism-list.component';
import { AddOrganismComponent } from './add-organism/add-organism.component';
import { EditOrganismComponent } from './edit-organism/edit-organism.component';


@NgModule({
  declarations: [
    OrganismComponent,
    OrganismListComponent,
    AddOrganismComponent,
    EditOrganismComponent
  ],
  imports: [
    OrganismRoutingModule,
    SharedModule
  ]
})
export class OrganismModule { }
