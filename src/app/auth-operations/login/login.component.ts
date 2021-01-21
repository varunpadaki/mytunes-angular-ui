import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/common-utils/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  overlayRef: OverlayRef;
  overlayService: OverlayService;
  loginForm: FormGroup;
  formBuilder: FormBuilder
  authService: AuthService;
  router: Router;
  showSpinner: boolean = false;
  alertService: AlertService;
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false,
    fade: true
};

  constructor(formBuilder: FormBuilder,authService: AuthService,router: Router,alertService: AlertService,overlayService: OverlayService) { 
    this.formBuilder = formBuilder;
    this.authService = authService;
    this.router = router;
    this.alertService = alertService;
    this.overlayService = overlayService;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',Validators.required]
    });
  }

  authenticateUser(){
    if(this.loginForm.valid){
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.showSpinner = true;
      this.authService.login(this.loginForm.controls["username"].value,this.loginForm.controls["password"].value).subscribe(
        success => {
        //success = {};
        //success["response"] = JSON.parse('{"userAuthorities":[{"roleName":"India Administrator"}]}');
        //success["jwtToken"] = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzZXVyenUxZG84cjcxdXJwNGZjMWtlZHpoN254dGZyYyIsImdyb3VwX3BvbGljeSI6Ik1hbmFnZVNlbGYsRWRpdFVzZXJNZXNzYWdlcyxNYW5hZ2VNZXNzYWdlcyxNYW5hZ2VVc2VyTWVzc2FnZXMsV3JpdGVNZXNzYWdlSGlzdG9yeSxSZWFkTWVzc2FnZUh1YkNyZWRlbnRpYWxzLE1lc3NhZ2VQdWJsaXNoZXIiLCJzY29wZSI6IndzLWhwLmNvbS9tZXNzYWdlaHViL2NsaWVudHMuT1dORVIgd3MtaHAuY29tL21lc3NhZ2VzZGIvdXNlcm1lc3NhZ2VzLk9XTkVSIHdzLWhwLmNvbS9tZXNzYWdlc2RiL3VzZXJtZXNzYWdlcy5ERUxFVEUgd3MtaHAuY29tL21lc3NhZ2VzZGIvdXNlcm1lc3NhZ2VzLldSSVRFIHdzLWhwLmNvbS9tZXNzYWdlc2RiL3VzZXJtZXNzYWdlcy5GVUxMIHdzLWhwLmNvbS9tZXNzYWdlc2RiL3VzZXJtZXNzYWdlcy5GVUxMIHdzLWhwLmNvbS9tZXNzYWdlc2RiL2hpc3RvcnkuV1JJVEUgd3MtaHAuY29tL21lc3NhZ2VodWIvc2VjcmV0cy5SRUFEIHdzLWhwLmNvbS9tZXNzYWdlaHViL3Rva2Vucy5XUklURSB3cy1ocC5jb20vbWVzc2FnZWh1Yi90b2tlbnMuUkVBRCB3cy1ocC5jb20vbWVzc2FnZWh1Yi9ldmVudHMuV1JJVEUgd3MtaHAuY29tL21lc3NhZ2VodWIvcmVjZWlwdHMuUkVBRCIsImlzcyI6Imh0dHBzOi8vYXV0aC5tZXNzYWdlaHViLmhwLmNvbS8iLCJleHAiOjE2MDg4MzQ4NDcsImlhdCI6MTYwODc0ODQ0NzQyMSwiY2xpZW50X2lkIjoiNENKc2hVdmtSR1RRWkI1N0R0M3hFd05HdTNVRjNwZngxIiwianRpIjoiOGZmOWY3MDctNDU0MC00MGYxLWFlMjMtMmQzZjg4MTkwNDU1In0.sLN8wuoDO6lfYAv3A8A-FqAEgB46KOwyC3AUx_Mj8A0";
          this.overlayRef.detach();
          this.authService.processSuccessLoginResponse(success);
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.overlayRef.detach();
          this.authService.processFailureLoginResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Invalid credentials',this.alertOptions);
        }
      ); 
    }
  }
}
