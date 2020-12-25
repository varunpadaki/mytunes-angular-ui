import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class RoleVO {

    id:string;
    roleName:string;
    createdBy:string;
    createdDate:Date;
    updatedBy:string;
    updatedTime:Date;
      
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
    return this.updatedTime;
  }

  public setUpdatedTime(updatedTime: Date){
    this.updatedTime = updatedTime;
  }
}
