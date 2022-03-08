import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginDTO } from 'src/app/dtos/login-dto';
import { AuthenticationTokensDTO } from 'src/app/dtos/authentication-tokens-dto';
import { AlertService } from '../alert/alert.service';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = `${environment.baseUrl}authentication`;
    private isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem("jwt") != null);
    private tokens: AuthenticationTokensDTO | undefined;

    isLoggedIn: boolean = false;

    constructor(
        private readonly _httpService: HttpService,
        private _alertService: AlertService) {
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

    handleError(error: any): Observable<AuthenticationTokensDTO> {
        this._alertService.error(error.message)
        return throwError(error);
    }

    login(loginModel: LoginDTO): Observable<AuthenticationTokensDTO> {
        let url = `${this.baseUrl}/login`

        return this._httpService.postUnauthorized<AuthenticationTokensDTO>(url, JSON.stringify(loginModel)).pipe(
            tap(data => {
                this.tokens = data;
                localStorage.setItem("jwt", JSON.stringify(data));
                this.isLoggedIn = true;
                this.isLoggedInSubject.next(true);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    logout() {
        this.isLoggedIn = false;
        this.isLoggedInSubject.next(false);
        this.tokens = undefined;
        localStorage.removeItem("jwt");
    }

    setTokens(tokens: AuthenticationTokensDTO) {
        this.tokens = tokens;
    }
}
