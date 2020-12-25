import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Alert, AlertType } from '../model/Alert';
import { filter } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<Alert>();
  private defaultId = "default-alert";
  private keepAfterRouteChange: boolean = false
  routeSubscription: Subscription;
  router: Router;

  constructor(router:Router) { 
    this.router = router;
    this.routeSubscription = this.router.events.subscribe( event => {
      if(event instanceof NavigationEnd){
        if(this.keepAfterRouteChange){
          //only keep for a single route change
          this.keepAfterRouteChange = false;
        }else{
          //clear alert message
          //setTimeout(() => this.clear(this.defaultId),5000);
          this.clear(this.defaultId);
        }
      }
    });
  }

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  success(message: string,options?: any){
    this.keepAfterRouteChange = options.keepAfterRouteChange;
    this.alert(new Alert({...options,type: AlertType.Success,message}));
  }

  error(message: string,options?: any){
    this.keepAfterRouteChange = options.keepAfterRouteChange;
    this.alert(new Alert({...options,type: AlertType.Error,message}));
  }

  info(message: string,options?: any){
    this.keepAfterRouteChange = options.keepAfterRouteChange;
    this.alert(new Alert({...options,type: AlertType.Info,message}));
  }

  warn(message: string,options?: any){
    this.keepAfterRouteChange = options.keepAfterRouteChange;
    this.alert(new Alert({...options,type: AlertType.Warning,message}));
  }

  alert(alert: Alert){
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
    //this.subject.next();
}

}
