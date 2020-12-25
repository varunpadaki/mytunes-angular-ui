import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationUtils } from 'src/app/common-utils/customvalidation.utils';
import { UserManagementService } from '../service/user-management.service';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/common-utils/overlay.service';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';
import { Router } from '@angular/router';
import { MytunesUtils } from 'src/app/common-utils/mytunes.utils';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm: FormGroup;
  formBuilder: FormBuilder
  userCityArray: object[];
  cutomValidationUtils: CustomvalidationUtils;
  userManagementService: UserManagementService;
  alertService: AlertService;
  userRoles: object[];
  cityData: object;
  overlayRef: OverlayRef;
  overlayService: OverlayService;
  router: Router;
  mytunesUtils: MytunesUtils;
  userDetails:object;
  genderValues: object[];
  
  //move to filters
  mindate = new Date();
  maxdate = new Date();
  customDateFilter = (d: Date | null): boolean => {
  const date = (d || new Date());
  this.mindate.setFullYear(1920,1,1);
  return date.getTime() >= this.mindate.getTime() && date.getTime()<this.maxdate.getTime();
} 
  
  constructor(formBuilder: FormBuilder,cutomValidationUtils: CustomvalidationUtils,userManagementService: UserManagementService,alertService: AlertService,overlayService: OverlayService,router: Router,mytunesUtils:MytunesUtils) { 
    this.formBuilder = formBuilder;
    this.userRoles = [];
    this.userCityArray = [];
    this.cutomValidationUtils = cutomValidationUtils;
    this.userManagementService = userManagementService;
    this.alertService = alertService;
    this.overlayService = overlayService;
    this.router = router;
    this.mytunesUtils = mytunesUtils;
    this.userDetails = {};
    this.genderValues = [];
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['',{
       validators: [Validators.required,this.cutomValidationUtils.usernameValidator],
       asyncValidators: [this.cutomValidationUtils.duplicateuserValidator.bind(this.cutomValidationUtils)],
       updateOn: 'blur' 
      }],
      usertype:['City Administrator',Validators.required],
      userCity:['',Validators.required],
      firstName:['',Validators.required],
      middleName:['',Validators.required],
      lastName:['',Validators.required],
      emailId:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,this.cutomValidationUtils.passwordValidator]],
      confirmPassword:['',Validators.required],
      gender:['',Validators.required],
      phoneNumber:['',[Validators.required,this.cutomValidationUtils.phoneNumberValidator]],
      dateOfBirth:['',Validators.required],
      address:['',Validators.required]
    },
    {
      validator: this.cutomValidationUtils.matchPassword('password','confirmPassword'),
    }
    );

    this.loadGenderValues();
    this.validateAndLoadUserDetails();
  }

  loadGenderValues() {
    this.genderValues.push({'val':'Male','checked':false});
    this.genderValues.push({'val':'Female','checked':false});
  }

  loadUserCities() {
    let userCityObservable = this.userManagementService.fetchUserCities();
    return userCityObservable;
  }

  loadUserRoles() {
    let userRolesObservable = this.userManagementService.fetchUserRoles();
    return userRolesObservable;
  }

  onCityChange(selectedCityId){
    let greyOutRole = false;
    for(let userRole in this.cityData){
      if(this.cityData.hasOwnProperty(userRole) && (userRole === "City Administrator" || userRole === "Market Research Manager")){
        let cityArr = this.cityData[userRole];
        let cityFilter = cityArr.filter((cityObj) => cityObj.id == selectedCityId);
        if(cityFilter.length > 0 && userRole === "City Administrator"){
          this.changeUserRole("Market Research Manager");
          greyOutRole = true;
          this.userForm.get("usertype").disable();
          this.userForm.get("usertype").updateValueAndValidity();
        }else if(cityFilter.length > 0 && userRole === "Market Research Manager"){
          this.changeUserRole("City Administrator");
          greyOutRole = true;
          this.userForm.get("usertype").disable();
          this.userForm.get("usertype").updateValueAndValidity();
        }
      }
    }

    if(!greyOutRole){
      this.userForm.get("usertype").enable();
      this.userForm.get("usertype").updateValueAndValidity();
    }
  }

  changeUserRole(userRole: string) {
    this.userRoles.forEach(userRoleObj => {
      if(userRoleObj["roleName"] == userRole){
        this.userForm.get("usertype").setValue(userRoleObj["id"]);
        userRoleObj["checked"] = true;
      }else{
        userRoleObj["checked"] = false;
      }
    });
  }

  changeGender(gender: string) {
    this.genderValues.forEach(genderObj => {
      if(genderObj["val"] == gender){
        this.userForm.get("gender").setValue(genderObj["name"]);
        genderObj["checked"] = true;
      }else{
        genderObj["checked"] = false;
      }
    });
  }

  createUser(){
    if(this.userForm.valid){
      console.log(this.userForm.value);
      let userVO = this.prepareUserData();
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.userManagementService.createUser(userVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.userManagementService.processCreateUserSuccessResponse(success);
          this.router.navigate(['/user/view']);
          this.alertService.success('User created successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.userManagementService.processCreateUserFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to create user.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }

  prepareUserData(){
    let userVO: object = {};
    userVO = JSON.parse(JSON.stringify(this.userForm.getRawValue()));
    let cityId = userVO["userCity"];
    let roleId = userVO["usertype"];
    delete userVO["confirmPassword"];
    delete userVO["userCity"];
    delete userVO["usertype"];

    userVO["cityVO"] = {};
    userVO["cityVO"]["id"]=cityId;
    userVO["userAuthorities"]= [];
    userVO["userAuthorities"].push({"id":roleId});
    let dob: Date = new Date(userVO["dateOfBirth"]);
    let dobString = new Date(dob.getTime() - (dob.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    userVO["dateOfBirth"] = dobString;
    console.log(JSON.stringify(userVO));
    console.log(this.userForm.value);
    return userVO;
  }

  validateAndLoadUserDetails() {
    let userCityObservable = this.loadUserCities();
    let userRolesObservable = this.loadUserRoles();
    if(!this.userManagementService.userData){
      userCityObservable.subscribe(
        success => {
          this.processGetUserCities(success);
      },
      error => {
        const errorMessage = ""; //get error message from error object
        this.alertService.error('Failed to load user cities.',this.mytunesUtils.getAlertOptions(true,false,true));
      });

      userRolesObservable.subscribe(
        success => {
          this.processGetUserRoles(success);
      },
      error => {
        const errorMessage = ""; //get error message from error object
        this.alertService.error('Failed to load user roles.',this.mytunesUtils.getAlertOptions(true,false,true));
      });
      return;
    }
    forkJoin(userCityObservable,userRolesObservable).subscribe(results=>{
      this.processGetUserCities(results[0]);
      this.processGetUserRoles(results[1]);
      let userVO = JSON.parse(this.userManagementService.userData);
    
    userVO["confirmPassword"] = userVO["password"];
    userVO["usertype"] = userVO["userAuthorities"][0]["id"];
    userVO["userCity"] = userVO["cityVO"]["id"];
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.controls[key].setValue(userVO[key]);
    });
    this.userForm.get("username").disable();
    this.userForm.get("password").disable();
    this.userForm.get("confirmPassword").disable();
    this.changeUserRole(userVO["userAuthorities"][0]["roleName"]);
    this.changeGender(userVO["gender"]);
    this.updateUserCityAndRoles(userVO["cityVO"]["id"]);
    this.userDetails = userVO;
    this.userManagementService.userData = "";
    this.userForm.updateValueAndValidity();
    },
    errors => {
      if(errors[0]){
        const errorMessage = ""; //get error message from error object
        this.alertService.error('Failed to load user cities.',this.mytunesUtils.getAlertOptions(true,false,true));
      }

      if(errors[1]){
        const errorMessage = ""; //get error message from error object
        this.alertService.error('Failed to load user roles.',this.mytunesUtils.getAlertOptions(true,false,true));
      }
    });
  }

  updateUserCityAndRoles(selectedCity: any) {
    if(this.userForm.controls["userCity"].value){
      let selectedCityArr = this.userCityArray.filter(o => {
        if(o["id"] === this.userForm.controls["userCity"].value && o["disabled"]){
          return true;
        }
    });
    if(selectedCityArr.length != 0){
      this.userForm.get("usertype").disable();
      this.userForm.get("usertype").updateValueAndValidity();
    }
    }
  }

  updateUser(){
    if(true){
      console.log(this.userForm.value);
      let userId = this.userDetails["id"];
      let userVO = this.prepareUserData();
      userVO["id"] = userId;
      userVO["createdDate"] = this.userDetails["createdDate"];
      userVO["createdBy"] = this.userDetails["createdBy"];
      userVO["accountLockedFlag"] = this.userDetails["accountLockedFlag"];
      userVO["userEnabledFlag"] = this.userDetails["userEnabledFlag"];
      console.log(JSON.stringify(userVO));
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.userManagementService.updateUser(userId,userVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.userManagementService.processUpdateUserSuccessResponse(success);
          this.router.navigate(['/user/view']);
          this.alertService.success('User updated successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.userManagementService.processUpdateUserFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to update user.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }

  processGetUserCities(cityResponse: any) {
    this.cityData = cityResponse;
    this.userCityArray = this.userManagementService.getFilteredCities(cityResponse);
  }

  processGetUserRoles(rolesResponse: any) {
    for(let i=0 ; i<rolesResponse.length;i++){
      if(rolesResponse[i].roleName !== "India Administrator" && rolesResponse[i].roleName !== "Store Manager"){
        let roleObj = {"id":rolesResponse[i].id,"roleName":rolesResponse[i].roleName,"checked":false};
        if(rolesResponse[i].roleName === "City Administrator"){
          this.userForm.get("usertype").setValue(rolesResponse[i].id);
          roleObj.checked = true;
        }
        this.userRoles.push(roleObj);
      }
    }
  }
}