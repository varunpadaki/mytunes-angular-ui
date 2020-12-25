import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class CityVO{
  cityName:string;
  id:string;
  stateCode:string;
  createdBy:string;
  createdDate:Date;
  updatedBy:string;
  updatedDate:Date;

  constructor(){}

  public getCityName():string{
    return this.cityName;
  }

  public setCityName(cityName:string){
    this.cityName = cityName;
  }

  
  public getId():string{
    return this.id;
  }

  public setId(id:string){
    this.id = id;
  }

  
  public getStateCode():string{
    return this.stateCode;
  }

  public setStateCode(stateCode:string){
    this.stateCode = stateCode;
  }

  
  public getCreatedBy():string{
    return this.createdBy;
  }

  public setCreatedBy(createdBy:string){
    this.createdBy = createdBy;
  }

  public getUpdatedBy():string{
    return this.updatedBy;
  }

  public setUpdatedBy(updatedBy:string){
    this.updatedBy = updatedBy;
  }

  public getCreatedDate():Date{
    return this.createdDate;
  }

  public setCreatedDate(createdDate:Date){
    this.createdDate = createdDate;
  }

  public getUpdatedDate():Date{
    return this.updatedDate;
  }

  public setUpdatedDate(updatedDate: Date){
    this.updatedDate = updatedDate;
  }
}