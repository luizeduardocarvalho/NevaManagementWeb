import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from 'src/services/auth-guard.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { UserHistoryComponent } from './user-history/user-history.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  {
    path: 'user-history',
    component: UserHistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'containers',
    loadChildren: () =>
      import('./container/container.module').then((m) => m.ContainerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'organisms',
    loadChildren: () =>
      import('./organism/organism.module').then((m) => m.OrganismModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'locations',
    loadChildren: () =>
      import('./location/location.module').then((m) => m.LocationModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./product-list/product.module').then((m) => m.ProductModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'equipment',
    loadChildren: () =>
      import('./equipment/equipment.module').then((m) => m.EquipmentModule),
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
