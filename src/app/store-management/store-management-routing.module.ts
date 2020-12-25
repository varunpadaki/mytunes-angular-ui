import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { CreateStoreComponent } from './create-store/create-store.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { StoreManagerComponent } from './store-manager/store-manager.component';

const routes: Route[] = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'create',component:CreateStoreComponent},
  {path:'view',component:ViewStoreComponent},
  {path:'manager/create',component:StoreManagerComponent},
  {path:'manager/edit',component:StoreManagerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreManagementRoutingModule { }
