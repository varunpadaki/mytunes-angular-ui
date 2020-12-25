import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UserManagementModule } from './user-management/user-management.module';
import { StoreManagementModule } from './store-management/store-management.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthOperationsModule } from './auth-operations/auth-operations.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomvalidationUtils } from './common-utils/customvalidation.utils';
import { AuthguardService } from './auth-guard/authguard.service';
import { AuthService } from './auth-operations/service/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from './alerts/service/alert.service';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { OverlayService } from './common-utils/overlay.service';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserManagementModule,
    StoreManagementModule,
    DashboardModule,
    AlertsModule,
    AuthOperationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    OverlayModule
  ],
  providers: [
    CustomvalidationUtils,
    AuthguardService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    AlertService,
    OverlayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
