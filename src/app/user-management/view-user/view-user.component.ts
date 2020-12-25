import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserManagementService } from '../service/user-management.service';
import { UserData } from '../model/user.data';
import * as _ from 'lodash';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { OverlayService } from 'src/app/common-utils/overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';
import { MytunesUtils } from 'src/app/common-utils/mytunes.utils';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  userManagementService: UserManagementService;
  columnObj: object;
  columns: string[] = ['firstName', 'lastName', 'emailId', 'phoneNumber', 'cityName', 'roleName','edit','delete'];
  dataSource: MatTableDataSource<UserData>;
  userDataArray: UserData[];
  userObj: UserData;
  alertService: AlertService;
  overlayService: OverlayService;
  overlayRef: OverlayRef;
  router: Router;
  mytunesUtils: MytunesUtils;

  constructor(userManagementService: UserManagementService,alertService:AlertService,overlayService:OverlayService,router:Router,mytunesUtils:MytunesUtils) {
    this.userManagementService = userManagementService;
    this.columnObj = {};
    this.userDataArray = [];
    this.dataSource = new MatTableDataSource();
    this.alertService = alertService;
    this.overlayService = overlayService;
    this.router = router;
    this.mytunesUtils = mytunesUtils;
  }
  
  ngOnInit(): void {
    this.getAllUsers();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllUsers() {
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.userManagementService.getAllUsers().subscribe(success => {
      this.overlayRef.detach();
      this.userDataArray = [];
      this.userDataArray = this.userDataArray.concat(success);
      this.userObj = this.userDataArray[0];
      this.userDataArray.forEach(userVO => {
        userVO["cityName"] = userVO["cityVO"]["cityName"];
        userVO["roleName"] = userVO["userAuthorities"][0]["roleName"];
      });
      this.dataSource = new MatTableDataSource(this.userDataArray);
      this.prepareColumnObject();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.overlayRef.detach();
      this.userDataArray = [];
      this.dataSource = new MatTableDataSource(this.userDataArray);
      this.prepareColumnObject();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const errorMessage = "No users found."; //get error message from error object
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  prepareColumnObject() {
    this.columns.forEach(column => {
      this.columnObj[column] = _.startCase(column);
    });
  }

  editUser(userObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.userManagementService.getUserById(userObj["id"]).subscribe(success => {
      this.overlayRef.detach();
      this.userManagementService.processEditUserSuccessResponse(success);
      this.router.navigate(['/user/create']);
    }, error => {
      this.overlayRef.detach();
      this.alertService.error('Failed to load user details.',this.mytunesUtils.getAlertOptions(true,false,true));
      const errorMessage = "Failed to load user."; //get error message from error object
    });
    console.log(JSON.stringify(userObj));
  }

  deleteUser(userObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.userManagementService.deleteUserById(userObj["id"]).subscribe(success => {
      this.overlayRef.detach();
      this.getAllUsers();
      this.alertService.success('User deleted successfully.',this.mytunesUtils.getAlertOptions(true,false,true));
    }, error => {
      this.overlayRef.detach();
      this.alertService.error('Failed to delete user.',this.mytunesUtils.getAlertOptions(true,false,true));
      const errorMessage = "Failed to delete user."; //get error message from error object
    });
    console.log(JSON.stringify(userObj));
  }
}
