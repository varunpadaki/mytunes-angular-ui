import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreManagementRoutingModule } from './store-management-routing.module';
import { CreateStoreComponent } from './create-store/create-store.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { StoreManagerComponent } from './store-manager/store-manager.component';


@NgModule({
  declarations: [CreateStoreComponent, ViewStoreComponent, StoreManagerComponent],
  imports: [
    CommonModule,
    StoreManagementRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class StoreManagementModule { }
