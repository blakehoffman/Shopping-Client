import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class OriginInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        console.log('here');
        const newRequest = request.clone({
            headers: request.headers.set('Origin', window.location.hostname)
        });

        return next.handle(newRequest);
    }
}