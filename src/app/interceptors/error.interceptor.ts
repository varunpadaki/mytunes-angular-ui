import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-operations/service/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
    authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    //common error filter
    //it will handle all API response errors
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request).pipe(catchError(err => {
            if(err.status == 401){
                this.authService.logout();
            }
            //const error = err.error.message || err.statusText;
            return throwError(err);
        }))
    }

}