import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationUtils } from 'src/app/common-utils/customvalidation.utils';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/common-utils/overlay.service';
import { Router } from '@angular/router';
import { MytunesUtils } from 'src/app/common-utils/mytunes.utils';
import { StoreManagementService } from '../service/store-management.service';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-store-manager',
  templateUrl: './store-manager.component.html',
  styleUrls: ['./store-manager.component.scss']
})
export class StoreManagerComponent implements OnInit {

  storeManagerForm: FormGroup;
  formBuilder: FormBuilder
  cityArray: object[];
  cutomValidationUtils: CustomvalidationUtils;
  storeManagementService: StoreManagementService;
  alertService: AlertService;
  overlayRef: OverlayRef;
  overlayService: OverlayService;
  router: Router;
  mytunesUtils: MytunesUtils;
  userDetails:object;
  genderValues: object[];
  storeId:string;
  
  //move to filters
  mindate = new Date();
  maxdate = new Date();
  customDateFilter = (d: Date | null): boolean => {
  const date = (d || new Date());
  this.mindate.setFullYear(1920,1,1);
  return date.getTime() >= this.mindate.getTime() && date.getTime()<this.maxdate.getTime();
} 
  
  constructor(formBuilder: FormBuilder,cutomValidationUtils: CustomvalidationUtils,storeManagementService: StoreManagementService,alertService: AlertService,overlayService: OverlayService,router: Router,mytunesUtils:MytunesUtils) { 
    this.formBuilder = formBuilder;
    this.cityArray = [];
    this.cutomValidationUtils = cutomValidationUtils;
    this.storeManagementService = storeManagementService;
    this.alertService = alertService;
    this.overlayService = overlayService;
    this.router = router;
    this.mytunesUtils = mytunesUtils;
    this.userDetails = {};
    this.genderValues = [];
  }

  ngOnInit(): void {
    this.storeManagerForm = this.formBuilder.group({
      username: ['',{
       validators: [Validators.required,this.cutomValidationUtils.usernameValidator],
       asyncValidators: [this.cutomValidationUtils.duplicateuserValidator.bind(this.cutomValidationUtils)],
       updateOn: 'blur' 
      }],
      userCity:['',Validators.required],
      firstName:['',Validators.required],
      storename:['',Validators.required],
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
    this.loadUserCity();
    this.validateAndLoadUserDetails();
  }

  validateAndLoadUserDetails() {
    if(this.storeManagementService.storeData && !this.storeManagementService.storeData["storeManagerVO"]){
      let storeVO = JSON.parse(this.storeManagementService.storeData);
      this.storeManagerForm.controls["storename"].setValue(storeVO["storename"]);
      this.storeId = storeVO["id"];
      this.storeManagementService.storeData = "";
    }

    if(this.storeManagementService.storeData && this.storeManagementService.storeData["storeManagerVO"]){
      let storeVO = JSON.parse(this.storeManagementService.storeData);
      let userVO = storeVO["storeManagerVO"];
      this.storeId = storeVO["id"];
    userVO["confirmPassword"] = userVO["password"];
    userVO["storeName"] = storeVO["storeName"];
    Object.keys(this.storeManagerForm.controls).forEach(key => {
      this.storeManagerForm.controls[key].setValue(userVO[key]);
    });
    this.storeManagerForm.get("username").disable();
    this.storeManagerForm.get("password").disable();
    this.storeManagerForm.get("confirmPassword").disable();
    this.changeGender(userVO["gender"]);
    this.userDetails = userVO;
    this.storeManagementService.storeData = "";
    this.storeManagerForm.updateValueAndValidity();
    }  
  }

  loadGenderValues() {
    this.genderValues.push({'val':'Male','checked':false});
    this.genderValues.push({'val':'Female','checked':false});
  }

  loadUserCity() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //currentUser = {};
    //currentUser["id"] = "1234";
    //currentUser["cityVO"] = {};
    //currentUser["cityVO"]["cityName"] = "Dharwad";
    let cityObj = {};
    cityObj["id"] = currentUser["cityVO"]["id"];
    cityObj["cityName"] = currentUser["cityVO"]["cityName"];
    cityObj["disabled"] = true;
    this.cityArray.push(cityObj);

    this.storeManagerForm.get("userCity").setValue(cityObj["id"]);
    this.storeManagerForm.get("userCity").disable();
    this.storeManagerForm.updateValueAndValidity();
  }

  changeGender(gender: string) {
    this.genderValues.forEach(genderObj => {
      if(genderObj["val"] == gender){
        this.storeManagerForm.get("gender").setValue(genderObj["name"]);
        genderObj["checked"] = true;
      }else{
        genderObj["checked"] = false;
      }
    });
  }

  createStoreManager(){
    if(this.storeManagerForm.valid){
      console.log(this.storeManagerForm.value);
      let userVO = this.prepareUserData();
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.storeManagementService.createStoreManager(this.storeId,userVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.storeManagementService.processCreateStoreManagerSuccessResponse(success);
          this.router.navigate(['/store/view']);
          this.alertService.success('Store manager created successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.storeManagementService.processCreateStoreManagerFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to create store manager.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }

  prepareUserData(){
    let userVO: object = {};
    userVO = JSON.parse(JSON.stringify(this.storeManagerForm.getRawValue()));
    let cityId = userVO["userCity"];
    delete userVO["confirmPassword"];
    delete userVO["storeName"];
    delete userVO["confirmPassword"];
    delete userVO["userCity"];

    userVO["cityVO"] = {};
    userVO["cityVO"]["id"]=cityId;
    let dob: Date = new Date(userVO["dateOfBirth"]);
    let dobString = new Date(dob.getTime() - (dob.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    userVO["dateOfBirth"] = dobString;
    console.log(JSON.stringify(userVO));
    console.log(this.storeManagerForm.value);
    return userVO;
  }

  updateStoreManager(){
    if(true){
      console.log(this.storeManagerForm.value);
      let userId = this.userDetails["id"];
      let userVO = this.prepareUserData();
      userVO["id"] = userId;
      userVO["createdDate"] = this.userDetails["createdDate"];
      userVO["createdBy"] = this.userDetails["createdBy"];
      userVO["accountLockedFlag"] = this.userDetails["accountLockedFlag"];
      userVO["userEnabledFlag"] = this.userDetails["userEnabledFlag"];
      console.log(JSON.stringify(userVO));
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.storeManagementService.updateStoreManager(userId,this.storeId,userVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.storeManagementService.processUpdateUserSuccessResponse(success);
          this.router.navigate(['/store/view']);
          this.alertService.success('User updated successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.storeManagementService.processUpdateUserFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to update user.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }
}
