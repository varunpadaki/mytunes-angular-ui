import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from "./view-user/view-user.component";
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateUserComponent, ViewUserComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CreateUserComponent,
    ViewUserComponent
  ]
})
export class UserManagementModule { }