import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  
  httpClient: HttpClient;
  router: Router;
  userData:string;

  constructor(httpClient: HttpClient,router:Router) { 
    this.httpClient = httpClient;
    this.router = router;
  }

  getFilteredCities(userCityResponse: any) {
    let userCity: object[] = [];

    if(userCityResponse.hasOwnProperty("ANONYMOUS") ){
      userCity = userCity.concat(userCityResponse.ANONYMOUS);
    }
    
    if(userCityResponse.hasOwnProperty("City Administrator") && userCityResponse.hasOwnProperty("Market Research Manager")){
      let indiaAdminCityFlag = false;
      let cityArr1 = userCityResponse["City Administrator"];
      let cityArr2 = userCityResponse["Market Research Manager"];

      let unique1 = cityArr1.filter(o1 => cityArr2.some(o2 => o1.cityName !== o2.cityName));
      let unique2 = cityArr2.filter(o1 => cityArr1.some(o2 => o1.cityName !== o2.cityName));

      let uniqueCityArr = unique1.concat(unique2);
      userCity = userCity.concat(uniqueCityArr);

      let common = cityArr1.filter(o1 => cityArr2.some(o2 => o1.cityName === o2.cityName));
      common.forEach(city => {
        city["disabled"]=true;
        userCity.push(city);
        if(city.cityName === userCityResponse["India Administrator"][0].cityName){
          indiaAdminCityFlag = true;
        }
      });
      if(!indiaAdminCityFlag){
        userCity = userCity.concat(userCityResponse["India Administrator"]);
      }
    } else if(userCityResponse.hasOwnProperty("City Administrator") || userCityResponse.hasOwnProperty("Market Research Manager")){
      let cityArr1 = userCityResponse["City Administrator"];
      let cityArr2 = userCityResponse["Market Research Manager"];

      if(cityArr1){
        userCity = userCity.concat(cityArr1);
      }
      if(cityArr2){
        userCity = userCity.concat(cityArr2);
      }
      userCity = userCity.concat(userCityResponse["India Administrator"]);      
    } else {
      userCity = userCity.concat(userCityResponse["India Administrator"]);
    }
    return userCity;
  }

  fetchUserCities() {
    return this.httpClient.get<any>('/usermanagement/users/citybyroles');
  }
 
  fetchUserRoles() {
    return this.httpClient.get<any>('/usermanagement/users/roles');
  }

  createUser(userData) {
    return this.httpClient.post<any>('/usermanagement/users',userData);
  }

  validateDuplicateUser(username: string) {   
    return this.httpClient.post<any>('/usermanagement/users/duplicateuser/'+username,null);
  }

  processCreateUserSuccessResponse(success: any) {
    console.log(success);
  }

  processCreateUserFailureResponse(error: any) {
    console.log(error);
  }

  getAllUsers() {
    return this.httpClient.get<any>('/usermanagement/users');
  }

  getUserById(userId:string) {
    return this.httpClient.get<any>('/usermanagement/users/id/'+userId);
  }

  processEditUserSuccessResponse(success: any) {
    this.userData = JSON.stringify(success);
  }

  deleteUserById(userId:string) {
    return this.httpClient.delete<any>('/usermanagement/users/'+userId);
  }

  processUpdateUserFailureResponse(error: any) {
    throw new Error("Method not implemented.");
  }
  processUpdateUserSuccessResponse(success: any) {
    
  }
  updateUser(userId: any, userVO: object) {
    return this.httpClient.put<any>('/usermanagement/users/'+userId,userVO);
  }

}
