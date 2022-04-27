import { NgModule } from '@angular/core';

import { LocationRoutingModule } from './location-routing.module';
import { LocationListComponent } from './location-list/location-list.component';
import { SharedModule } from '../shared/shared.module';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { LocationComponent } from './location.component';


@NgModule({
  declarations: [
    LocationComponent,
    LocationListComponent,
    EditLocationComponent,
    AddLocationComponent
  ],
  imports: [
    LocationRoutingModule,
    SharedModule
  ]
})
export class LocationModule { }
