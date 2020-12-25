import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from "./view-user/view-user.component";

const routes: Route[] = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'create',component:CreateUserComponent},
  {path:'view',component:ViewUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
