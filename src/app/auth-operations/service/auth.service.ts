import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  jwtHelperService: JwtHelperService;
  httpClient: HttpClient;
  router: Router;
  apiUrl = environment.apiUrl;
  
  private _statusChange$: Subject<Boolean>;
  public loginStatus$: Observable<any>;

  constructor(jwtHelperService: JwtHelperService,httpClient: HttpClient,router:Router) {
    this.jwtHelperService = jwtHelperService;
    this.httpClient = httpClient;
    this.router = router;
    this._statusChange$ = new Subject<Boolean>();
    this.loginStatus$ = this._statusChange$.asObservable();
   }

   public isAuthenticated(): boolean{
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");
    if(!token || !currentUser){
      return false;
    }
    /*if(this.jwtHelperService.isTokenExpired(token)){
      return false;
    }*/
    return true;
   }

   public login(username: string,password: string): Observable<any>{
    return this.httpClient.post<any>(this.apiUrl+'/authmanagement/auth/login',{username: username, password: password});
   }

   public processFailureLoginResponse(errorResponse: any) {
    if(errorResponse){
      console.log(JSON.stringify(errorResponse));
    }
  }
   public processSuccessLoginResponse(successResponse: any) {
    if(successResponse){
      console.log(JSON.stringify(successResponse));
      localStorage.setItem('currentUser',JSON.stringify(successResponse.response));
      localStorage.setItem('token',successResponse.jwtToken);
      this._statusChange$.next(true);
    }
  }
  
  public logout(){
   localStorage.clear();
   this._statusChange$.next(false);
   this.router.navigate(['/auth/login']);
  }
}
