import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem("token");
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if(currentUser && token){
            request = request.clone({headers: request.headers.set('Authorization', 'Bearer '+ token)});
            request = request.clone({headers: request.headers.set('Content-Type','application/json')});
        }
    
        let success = {};
        success["response"] = JSON.parse('{"userAuthorities":[{"roleName":"India Administrator"}]}');
        success["jwtToken"] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDg5MDc3NzMsImV4cCI6MTY0MDQ0Mzc3MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6InRlc3QiLCJTdXJuYW1lIjoidGVzdCIsIkVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.cKjTjcJrEFEhT_-krIjLm4ZEOhQo1mbVK0YRp94xQmg";
        return of(new HttpResponse({ status: 200, body: ((success) as any).default }));
        //return next.handle(request);
    }
}