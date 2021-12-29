import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from 'src/app/dtos/login';
import { AuthenticationTokens } from 'src/app/dtos/authentication-tokens';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = `${environment.baseUrl}authentication`;
    private httpNoIntercept: HttpClient;
    private tokens: AuthenticationTokens | undefined;

    constructor(private handler: HttpBackend) {
        this.httpNoIntercept = new HttpClient(handler);
    }

    isUserLoggedIn: boolean = false;

    getAccessToken(): string | undefined {
        return this.tokens?.accessToken;
    }

    getRefreshToken(): string | undefined {
        return this.tokens?.refreshToken;
    }

    login(loginModel: Login): Observable<AuthenticationTokens> {
        var url = `${this.baseUrl}/login`
        var requestHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        var requestOptions = {
            headers: requestHeaders
        };

        return this.httpNoIntercept.post<AuthenticationTokens>(url, loginModel, requestOptions).pipe(
            tap(data => {
                this.tokens = data;
                localStorage.setItem("jwt", JSON.stringify(data))
            }),
            catchError((error) => throwError(error))
        );
    }

    logout() {
        this.tokens = undefined;
        localStorage.removeItem("jwt");
    }

    setTokens(tokens: AuthenticationTokens) {
        this.tokens = tokens;
    }
}
