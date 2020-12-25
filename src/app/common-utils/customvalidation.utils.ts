import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { UserManagementService } from '../user-management/service/user-management.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StoreManagementService } from '../store-management/service/store-management.service';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationUtils {

  userManagementService: UserManagementService;
  storeManagementService: StoreManagementService; 

  constructor(userManagementService: UserManagementService,storeManagementService: StoreManagementService) {
    this.userManagementService = userManagementService;
    this.storeManagementService = storeManagementService;
   }

  passwordValidator(control: AbstractControl): {[key: string]:any} | null{
    const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    const passwordValidFlag: boolean = passwordRegex.test(control.value);
    if(!control.value){
      return null;
    }
    return passwordValidFlag ? null : {invalidPassword:true};
  }

  phoneNumberValidator(control: AbstractControl): {[key: string]:any} | null{
    const phoneNumberRegex = new RegExp('[6-9]{1}[0-9]{9}');
    const phoneNumberValidFlag: boolean = phoneNumberRegex.test(control.value);
    if(!control.value){
      return null;
    }
    return phoneNumberValidFlag ? null : {invalidPhoneNumber:true};
  }

  matchPassword(password: string,confirmPassword: string){
    return (formGroup: FormGroup) =>{
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if(!passwordControl || !confirmPasswordControl){
        return null;
      }

      if(confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch){
        return null;
      }

      if(passwordControl.value !== confirmPasswordControl.value){
        confirmPasswordControl.setErrors({passwordMismatch: true});
      }else{
        confirmPasswordControl.setErrors(null);
      }

    };
  }

  usernameValidator(control: AbstractControl): {[key: string]:any} | null{
    const username = control.value;
    const usernameRegex = new RegExp('^(?=[a-z_\d]*[a-z])[a-z_\d]{6,30}$');
    const usernameValidFlag: boolean = usernameRegex.test(username);
    if(!control.value){
      return null;
    }

    return usernameValidFlag ? null : {invalidUsername:true};
  }

  duplicateuserValidator(control: AbstractControl): Observable<ValidationErrors | null>{
    const username = control.value;
    const usernameRegex = new RegExp('^(?=[a-z_\d]*[a-z])[a-z_\d]{6,30}$');
    const usernameValidFlag: boolean = usernameRegex.test(username);
    if(!control.value){
      return null;
    }

    if(usernameValidFlag){
      //change the response to 200 and boolean true/false
      return this.userManagementService.validateDuplicateUser(username).pipe(
        map(res => {
          console.log(res);
          return res.DUPLICATE_USER_FLAG ? {duplicateUsername:true} : null;
        }),
        catchError(err => {
          console.log(err);
          return null;
        })
      ); 
    }
  }

  storenameValidator(control: AbstractControl): {[key: string]:any} | null{
    const storename = control.value;
    const storenameRegex = new RegExp('^[a-zA-Z0-9]{6,20}$');
    const storenameValidFlag: boolean = storenameRegex.test(storename);
    if(!control.value){
      return null;
    }
    return storenameValidFlag ? null : {invalidStorename:true};
  }

  duplicateStoreValidator(control: AbstractControl): Observable<ValidationErrors | null>{
    const storename = control.value;
    const storenameRegex = new RegExp('^[a-zA-Z0-9]{6,20}$');
    const storenameValidFlag: boolean = storenameRegex.test(storename);
    if(!control.value){
      return null;
    }

    if(storenameValidFlag){
      return this.storeManagementService.validateDuplicateStore(storename).pipe(
        map(res => {
          console.log(res);
          return res.DUPLICATE_STORE_FLAG ? {duplicateStorename:true} : null;
        }),
        catchError(err => {
          console.log(err);
          return null;
        })
      ); 
    }
  }
}
