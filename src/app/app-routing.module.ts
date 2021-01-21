import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthguardService } from './auth-guard/authguard.service';
import { LogoutComponent } from './auth-operations/logout/logout.component';

const routes: Route[] = [
  {path:'',redirectTo:'auth',pathMatch:'full'},
  {path:'auth',loadChildren:'../app/auth-operations/auth-operations.module#AuthOperationsModule'},
  {path:'user',loadChildren:'../app/user-management/user-management.module#UserManagementModule'},
  {path:'store',loadChildren:'../app/store-management/store-management.module#StoreManagementModule'},
  {path:'dashboard',loadChildren:'../app/dashboard/dashboard.module#DashboardModule',canActivate:[AuthguardService]},
  {path:'logout',component:LogoutComponent,canActivate:[AuthguardService]},
  {path: '**',redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
