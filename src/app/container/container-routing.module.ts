import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContainerComponent } from './add-container/add-container.component';
import { ContainerListComponent } from './container-list/container-list.component';
import { ContainerComponent } from './container.component';

const routes: Routes = [
  { 
    path: '', 
    component: ContainerComponent,
    children: [
      { path: '', component: ContainerListComponent },
      { path: 'add', component: AddContainerComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule { }
