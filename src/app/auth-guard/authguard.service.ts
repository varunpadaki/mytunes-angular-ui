import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth-operations/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  router: Router;
  authService: AuthService;
  
  constructor(router: Router,authService: AuthService) { 
    this.router = router;
    this.authService = authService;
  }

  canActivate(): boolean{
    if(!this.authService.isAuthenticated()){
      this.authService.logout();
      return false;
    }
    return true;
  }
}
