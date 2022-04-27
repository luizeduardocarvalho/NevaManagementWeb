import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLocationComponent } from './add-location/add-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationComponent } from './location.component';

const routes: Routes = [
  { 
    path: '', 
    component: LocationComponent,
    children: [
      { path: '', component: LocationListComponent },
      { path: ':id/edit', component: EditLocationComponent },
      { path: 'add', component: AddLocationComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
