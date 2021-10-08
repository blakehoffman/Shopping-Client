import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    readonly defaultHeaders: HttpHeaders;
    readonly httpNoIntercept: HttpClient;

    constructor(
        private readonly http: HttpClient,
        handler: HttpBackend
    ) {
        this.defaultHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        this.httpNoIntercept = new HttpClient(handler);
    }

    get<T>(url: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;
        var requestOptions = {
            headers: requestHeaders
        };

        this.http.get<T>(url, requestOptions).pipe(
            catchError((error) => throwError(error))
        );
    }

    getUnauthorized<T>(url: string, headers: HttpHeaders | undefined): any {
        var requestHeaders = headers ?? this.defaultHeaders;
        var requestOptions = {
            headers: requestHeaders
        };

        this.httpNoIntercept.get<T>(url, requestOptions).pipe(
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
        var requestOptions = {
            headers: requestHeaders
        };

        this.httpNoIntercept.post<T>(url, body, requestOptions).pipe(
            catchError((error) => throwError(error))
        );
    }
}
