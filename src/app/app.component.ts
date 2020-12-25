import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './auth-operations/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'My Tunes';
  authService: AuthService;
  isLoggedIn: boolean = false;
  currentUser: Object;
  userRole:string;
  router:Router;

  constructor(authService: AuthService,router:Router){
    this.authService = authService;
    this.router = router;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    //this.isLoggedIn = true;
    this.loadCurrentUser();
    this.getCurrentUserRole();

    let sub = this.authService.loginStatus$.subscribe((loggedInFlag)=>{
      if(loggedInFlag){
        this.isLoggedIn = this.authService.isAuthenticated();
        this.loadCurrentUser();
        this.getCurrentUserRole();
      }
    },
    error => 
    {
      console.log(error);
    });
  }

  logout(){
    if(this.isLoggedIn){
      this.isLoggedIn = false;
      this.authService.logout();
    }
  }

  loadCurrentUser() {
    if(this.isLoggedIn){
      this.currentUser = {};
      //this.currentUser["firstName"] = "Varun";
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }
  }

  getCurrentUserRole() {
    if(this.isLoggedIn){
      //this.userRole = "City Administrator";
      this.userRole = this.currentUser["userAuthorities"][0]["roleName"];
    }
  }

}
