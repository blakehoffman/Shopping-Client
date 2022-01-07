import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { USE_AUTHENTICATION } from 'src/app/http-interceptors/auth-interceptor';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    readonly defaultHeaders: HttpHeaders;

    constructor(private readonly http: HttpClient) {
        this.defaultHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    get<T>(url: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;
        var requestOptions = {
            headers: requestHeaders
        };

        this.http.get<T>(url, requestOptions)
            .pipe(catchError((error) => throwError(error)));
    }

    getUnauthorized<T>(url: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;

        this.http.get<T>(
            url,
            {
                context: new HttpContext().set(USE_AUTHENTICATION, false),
                headers: requestHeaders
            })
            .pipe(
                catchError((error) => throwError(error))
            );
    }

    post<T>(url: string, body: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;
        var requestOptions = {
            headers: requestHeaders
        };

        this.http.post<T>(url, body, requestOptions).pipe(
            catchError((error) => throwError(error))
        );
    }

    postUnauthorized<T>(url: string, body: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;

        this.http.post<T>(
            url,
            body,
            {
                context: new HttpContext().set(USE_AUTHENTICATION, false),
                headers: requestHeaders
            })
            .pipe(
                catchError((error) => throwError(error))
            );
    }
}
