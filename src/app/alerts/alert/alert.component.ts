import { Component, OnInit, Input } from '@angular/core';
import { Alert, AlertType } from '../model/Alert';
import { Subscription } from 'rxjs';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() id = "default-alert";
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  alertService: AlertService;

  constructor(alertService: AlertService) {
    this.alertService = alertService;
   }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.onAlert(this.id).subscribe(alert =>{
      if(!alert.message){
        this.alerts = [];
        return;
      }
      this.alerts.push(alert);
      if(alert.autoClose){
        setTimeout(() => this.removeAlert(alert),3000);
      }
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }

  removeAlert(alert: Alert){
    if(!this.alerts.includes(alert)){
      return;
    }
    
    if(alert.fade){
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x!== alert);
      }, 250);
    } else {
      this.alerts = this.alerts.filter(x => x!= alert);
    }
  }

  alertsCssClass(alert: Alert){
    if(!alert) return;

    const classes = ['alert','show','alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    }

    classes.push(alertTypeClass[alert.type]);

    if(alert.fade){
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
