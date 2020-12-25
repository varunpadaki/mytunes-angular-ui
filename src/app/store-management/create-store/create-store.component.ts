import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationUtils } from 'src/app/common-utils/customvalidation.utils';
import { StoreManagementService } from '../service/store-management.service';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/common-utils/overlay.service';
import { Router } from '@angular/router';
import { MytunesUtils } from 'src/app/common-utils/mytunes.utils';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  storeForm: FormGroup;
  formBuilder: FormBuilder
  cutomValidationUtils: CustomvalidationUtils;
  storeManagementService: StoreManagementService;
  alertService: AlertService;
  overlayRef: OverlayRef;
  overlayService: OverlayService;
  router: Router;
  mytunesUtils: MytunesUtils;
  cityArr:Object[];
  storeDetails:Object[];

  constructor(formBuilder: FormBuilder,cutomValidationUtils: CustomvalidationUtils,storeManagementService: StoreManagementService,alertService: AlertService,overlayService: OverlayService,router: Router,mytunesUtils:MytunesUtils) {
    this.formBuilder = formBuilder;
    this.cutomValidationUtils = cutomValidationUtils;
    this.storeManagementService = storeManagementService;
    this.alertService = alertService;
    this.overlayService = overlayService;
    this.router = router;
    this.mytunesUtils = mytunesUtils;
    this.cityArr = [];
   }

  ngOnInit(): void {
    this.storeForm = this.formBuilder.group({
      storename: ['',{
       validators: [Validators.required,this.cutomValidationUtils.storenameValidator],
       asyncValidators: [this.cutomValidationUtils.duplicateStoreValidator.bind(this.cutomValidationUtils)],
       updateOn: 'blur' 
      }],
      //storename: ['',[Validators.required,this.cutomValidationUtils.storenameValidator]],
      storeCity:['',Validators.required],
      timings:['',Validators.required],
      capacity:['',Validators.required],
      emailId:['',[Validators.required,Validators.email]],
      phoneNumber:['',[Validators.required,this.cutomValidationUtils.phoneNumberValidator]],
      address:['',Validators.required]
    }
    );

    this.loadUserCity();
    this.loadStoreDetails();
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
    this.cityArr.push(cityObj);

    this.storeForm.get("storeCity").setValue(cityObj["id"]);
    this.storeForm.get("storeCity").disable();
    this.storeForm.updateValueAndValidity();
  }

  createStore(){
    if(this.storeForm.valid){
      console.log(this.storeForm.value);
      let storeVO = this.prepareStoreData();
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.storeManagementService.createStore(storeVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.storeManagementService.processCreateStoreSuccessResponse(success);
          this.router.navigate(['/store/view']);
          this.alertService.success('Store created successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.storeManagementService.processCreateStoreFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to create store.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }

  prepareStoreData() {
    let storeVO: object = {};
    storeVO = JSON.parse(JSON.stringify(this.storeForm.getRawValue()));
    let cityId = storeVO["storeCity"];
    delete storeVO["storeCity"];

    storeVO["cityVO"] = {};
    storeVO["cityVO"]["id"]=cityId;
    console.log(JSON.stringify(storeVO));
    console.log(this.storeForm.value);
    return storeVO;
  }

  loadStoreDetails() {  
    if(!this.storeManagementService.storeData){
      return;
    }
    let storeVO = JSON.parse(this.storeManagementService.storeData);
    storeVO["storeCity"] = storeVO["cityVO"]["id"];
    Object.keys(this.storeForm.controls).forEach(key => {
      this.storeForm.controls[key].setValue(storeVO[key]);
    });
    this.storeForm.updateValueAndValidity();
    this.storeDetails = storeVO;
    this.storeManagementService.storeData = "";
  }

  updateStore(){
    if(true){
      console.log(this.storeForm.value);
      let storeId = this.storeDetails["id"];
      let storeVO = this.prepareStoreData();
      storeVO["id"] = storeId;
      storeVO["createdDate"] = this.storeDetails["createdDate"];
      storeVO["createdBy"] = this.storeDetails["createdBy"];
      storeVO["updatedBy"] = this.storeDetails["createdBy"];
      //if store details has city and manager details then update JSON
      console.log(JSON.stringify(storeVO));
      this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
      this.storeManagementService.updateStore(storeId,storeVO).subscribe(
        success => {
          this.overlayRef.detach();
          this.storeManagementService.processUpdateStoreSuccessResponse(success);
          this.router.navigate(['/store/view']);
          this.alertService.success('Store updated successfully.',this.mytunesUtils.getAlertOptions(false,true,true));
        },
        error => {
          this.overlayRef.detach();
          this.storeManagementService.processUpdateStoreFailureResponse(error);
          const errorMessage = ""; //get error message from error object
          this.alertService.error('Failed to update store.',this.mytunesUtils.getAlertOptions(true,false,true));
        }
      ); 
    }
  }
}
