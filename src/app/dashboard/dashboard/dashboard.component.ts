import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-operations/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  authService:AuthService;
  constructor(authService:AuthService) {
    this.authService = authService;
   }

  ngOnInit(): void {
  }

}
