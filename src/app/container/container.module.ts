import { NgModule } from '@angular/core';

import { ContainerRoutingModule } from './container-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContainerListComponent } from './container-list/container-list.component';
import { AddContainerComponent } from './add-container/add-container.component';
import { ContainerComponent } from './container.component';
import { ContainerCardComponent } from './container-card/container-card.component';


@NgModule({
  declarations: [
    ContainerComponent,
    ContainerListComponent,
    AddContainerComponent,
    ContainerCardComponent
  ],
  imports: [
    ContainerRoutingModule,
    SharedModule
  ]
})
export class ContainerModule { }
