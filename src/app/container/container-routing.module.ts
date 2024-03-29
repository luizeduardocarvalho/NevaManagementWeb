import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContainerComponent } from './add-container/add-container.component';
import { ContainerCardComponent } from './container-card/container-card.component';
import { ContainerListComponent } from './container-list/container-list.component';
import { ContainerComponent } from './container.component';
import { NextTransfersComponent } from './next-transfers/next-transfers.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: ContainerListComponent },
      { path: 'add', component: AddContainerComponent },
      { path: 'next-transfers', component: NextTransfersComponent },
      { path: ':id', component: ContainerCardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainerRoutingModule {}
