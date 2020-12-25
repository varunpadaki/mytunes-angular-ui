import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomvalidationUtils } from 'src/app/common-utils/customvalidation.utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  formBuilder: FormBuilder;
  cutomValidationUtils: CustomvalidationUtils;

  constructor(formBuilder: FormBuilder,cutomValidationService: CustomvalidationUtils) { 
    this.formBuilder = formBuilder;
    this.cutomValidationUtils = cutomValidationService;
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      username:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,this.cutomValidationUtils.passwordValidator]],
      confirmPassword:['',Validators.required]
    },
    {
      validator: this.cutomValidationUtils.matchPassword('password','confirmPassword'),
    }
    );
  }

  registerUser(){
    console.log("Form validated successfully!");
  }

}
