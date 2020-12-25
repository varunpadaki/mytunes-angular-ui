import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthOperationsRoutingModule } from './auth-operations-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [LoginComponent, LogoutComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthOperationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ]
})
export class AuthOperationsModule { }
