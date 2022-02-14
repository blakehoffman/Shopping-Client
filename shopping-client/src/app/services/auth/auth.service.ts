import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginDTO } from 'src/app/dtos/login-dto';
import { AuthenticationTokensDTO } from 'src/app/dtos/authentication-tokens-dto';
import { AlertService } from '../alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = `${environment.baseUrl}authentication`;
    private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem("jwt") != null);
    private tokens: AuthenticationTokensDTO | undefined;

    constructor(
        private readonly http: HttpClient,
        private alertService: AlertService) {
    }
    
    get isLoggedInChange(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable();
    }

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
        let url = `${this.baseUrl}/login`
        let requestHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        let requestOptions = {
            headers: requestHeaders
        };

        return this.http.post<AuthenticationTokensDTO>(url, loginModel, requestOptions).pipe(
            tap(data => {
                this.tokens = data;
                localStorage.setItem("jwt", JSON.stringify(data));
                this.isLoggedInSubject.next(true);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    logout() {
        this.isLoggedInSubject.next(false);
        this.tokens = undefined;
        localStorage.removeItem("jwt");
    }

    setTokens(tokens: AuthenticationTokensDTO) {
        this.tokens = tokens;
    }
}
