import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreManagementService {
  
  httpClient: HttpClient;
  storeData: string;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
   }

  validateDuplicateStore(storename: any) {
    return this.httpClient.post<any>('/storemanagement/stores/duplicatestore/'+storename,null);
  }

  createStore(storeData) {
    return this.httpClient.post<any>('/storemanagement/stores',storeData);
  }

  getAllStores() {
    return this.httpClient.get<any>('/storemanagement/stores');
  }

  getStoreById(storeId:string) {
    return this.httpClient.get<any>('/storemanagement/stores/id/'+storeId);
  }

  deleteStoreById(storeId:string) {
    return this.httpClient.delete<any>('/storemanagement/stores/'+storeId);
  }

  updateStore(storeId: any, storeVO: object) {
    return this.httpClient.put<any>('/storemanagement/stores/'+storeId,storeVO);
  }

  createStoreManager(storeId: string,userVO: object) {
    return this.httpClient.post<any>('/storemanagement/stores/'+storeId+'/manager',userVO);
  }

  updateStoreManager(managerId: string, storeId: string, userVO: object) {
    return this.httpClient.post<any>('/storemanagement/stores/'+storeId+'/manager'+managerId,userVO);
  }

  processCreateStoreSuccessResponse(success: any) {
    console.log(success);
  }

  processCreateStoreFailureResponse(error: any) {
    console.log(error);
  }

  processEditStoreSuccessResponse(success: any) {
    this.storeData = JSON.stringify(success);
  }

  processUpdateStoreFailureResponse(error: any) {
  }

  processUpdateStoreSuccessResponse(success: any) {
  }

  processCreateStoreManagerSuccessResponse(success: any) {
    throw new Error("Method not implemented.");
  }

  processCreateStoreManagerFailureResponse(error: any) {
    throw new Error("Method not implemented.");
  }
  processUpdateUserSuccessResponse(success: any) {
    throw new Error("Method not implemented.");
  }
  processUpdateUserFailureResponse(error: any) {
    throw new Error("Method not implemented.");
  }
}
