import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { UserHistoryComponent } from './user-history/user-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'user-history', component: UserHistoryComponent },
  { 
    path: 'containers', 
    loadChildren: () => import('./container/container.module').then(m => m.ContainerModule)
  },
  { 
    path: 'organisms', 
    loadChildren: () => import('./organism/organism.module').then(m => m.OrganismModule)
  },
  { 
    path: 'locations', 
    loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
  },
  { 
    path: 'products', 
    loadChildren: () => import('./product-list/product.module').then(m => m.ProductModule)
  },
  { 
    path: 'equipment', 
    loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
