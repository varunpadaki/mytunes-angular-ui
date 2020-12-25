import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/alerts/service/alert.service';
import { OverlayService } from 'src/app/common-utils/overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { MytunesUtils } from 'src/app/common-utils/mytunes.utils';
import { ProgressSpinnerComponent } from 'src/app/progress-spinner/progress-spinner.component';
import * as _ from 'lodash';
import { StoreManagementService } from '../service/store-management.service';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  storeManagementService: StoreManagementService;
  columnObj: object;
  columns: string[] = ['storename', 'timings', 'capacity', 'cityName','storeManager','edit','delete'];
  dataSource: MatTableDataSource<Object>;
  storeDataArray: Object[];
  storeObj: Object;
  alertService: AlertService;
  overlayService: OverlayService;
  overlayRef: OverlayRef;
  router: Router;
  mytunesUtils: MytunesUtils;

  constructor(storeManagementService: StoreManagementService,alertService:AlertService,overlayService:OverlayService,router:Router,mytunesUtils:MytunesUtils) {
    this.storeManagementService = storeManagementService;
    this.columnObj = {};
    this.storeDataArray = [];
    this.dataSource = new MatTableDataSource();
    this.alertService = alertService;
    this.overlayService = overlayService;
    this.router = router;
    this.mytunesUtils = mytunesUtils;
  }
  
  ngOnInit(): void {
    this.getAllStores();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllStores() {
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.storeManagementService.getAllStores().subscribe(success => {
      this.overlayRef.detach();
      this.storeDataArray = [];
      this.storeDataArray = this.storeDataArray.concat(success);
      this.storeObj = this.storeDataArray[0];
      this.storeDataArray.forEach(storeVO => {
        storeVO["cityName"] = storeVO["cityVO"]["cityName"];
      });
      this.dataSource = new MatTableDataSource(this.storeDataArray);
      this.prepareColumnObject();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.overlayRef.detach();
      this.storeDataArray = [];
      this.dataSource = new MatTableDataSource(this.storeDataArray);
      this.prepareColumnObject();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const errorMessage = "No stores found."; //get error message from error object
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

  editStore(storeObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.storeManagementService.getStoreById(storeObj["id"]).subscribe(success => {
      this.overlayRef.detach();
      this.storeManagementService.processEditStoreSuccessResponse(success);
      this.router.navigate(['/store/create']);
    }, error => {
      this.overlayRef.detach();
      this.alertService.error('Failed to load store details.',this.mytunesUtils.getAlertOptions(true,false,true));
      const errorMessage = "Failed to load store."; //get error message from error object
    });
    console.log(JSON.stringify(storeObj));
  }

  deleteStore(storeObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.storeManagementService.deleteStoreById(storeObj["id"]).subscribe(success => {
      this.overlayRef.detach();
      this.getAllStores();
      this.alertService.success('Store deleted successfully.',this.mytunesUtils.getAlertOptions(true,false,true));
    }, error => {
      this.overlayRef.detach();
      this.alertService.error('Failed to delete store.',this.mytunesUtils.getAlertOptions(true,false,true));
      const errorMessage = "Failed to delete store."; //get error message from error object
    });
    console.log(JSON.stringify(storeObj));
  }

  createStoreManager(storeObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    //pass store name and id details to storemanager component
    this.storeManagementService.storeData = JSON.stringify(storeObj);
    this.router.navigate(['/store/manager/create']);
    this.overlayRef.detach();
  }

  editStoreManager(storeObj:Object){
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    this.storeManagementService.storeData = JSON.stringify(storeObj);
    this.router.navigate(['/store/manager/edit']);
    this.overlayRef.detach();
  }
}
