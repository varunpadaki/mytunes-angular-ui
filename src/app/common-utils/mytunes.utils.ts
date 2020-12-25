import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
 export class MytunesUtils{
     
    getAlertOptions(autoCloseOption:boolean,keepAfterRouteChangeOption:boolean,fadeOption:boolean){
        let alertOptions = {
          autoClose: autoCloseOption,
          keepAfterRouteChange: keepAfterRouteChangeOption,
          fade: fadeOption
      };
      return alertOptions;
      }
 }