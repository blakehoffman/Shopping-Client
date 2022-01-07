import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginDTO } from 'src/app/dtos/login-dto';
import { AuthenticationTokensDTO } from 'src/app/dtos/authentication-tokens-dto';
import { AlertService } from '../alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = `${environment.baseUrl}authentication`;
    private httpNoIntercept: HttpClient;
    private tokens: AuthenticationTokensDTO | undefined;

    constructor(
        private handler: HttpBackend,
        private alertService: AlertService) {
        this.httpNoIntercept = new HttpClient(handler);
    }

    isUserLoggedIn: boolean = false;

    getAccessToken(): string | undefined {
        return this.tokens?.accessToken;
    }

    getRefreshToken(): string | undefined {
        return this.tokens?.refreshToken;
    }

    handleError(error: string): Observable<AuthenticationTokensDTO> {
        this.alertService.error(error)
        return throwError(error);
    }

    login(loginModel: LoginDTO): Observable<AuthenticationTokensDTO> {
        var url = `${this.baseUrl}/login`
        var requestHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        var requestOptions = {
            headers: requestHeaders
        };
        console.log(url);
        return this.httpNoIntercept.post<AuthenticationTokensDTO>(url, loginModel, requestOptions).pipe(
            tap(data => {
                this.tokens = data;
                localStorage.setItem("jwt", JSON.stringify(data));
                console.log(data);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    logout() {
        this.tokens = undefined;
        localStorage.removeItem("jwt");
    }

    setTokens(tokens: AuthenticationTokensDTO) {
        this.tokens = tokens;
    }
}
