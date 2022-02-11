import { HttpClient, HttpContextToken, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { AuthService } from "../services/auth/auth.service";

export const USE_AUTHENTICATION = new HttpContextToken<boolean>(() => true);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(
		private _authService: AuthService,
		private _http: HttpClient
	) { }

	addAuthHeader(request: HttpRequest<any>, accessToken: string) {
		if (accessToken == undefined) {
			return request;
		}

		const authReq = request.clone({
			headers: request.headers.set('Authorization', accessToken)
		});

		return authReq;
	}

	handleRefreshError(error: string): Observable<any> {
		this._authService.logout();
		return throwError(error);
	}

	handleResponseError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		if (error.status != 401) {
			return throwError(error);
		}

		if (this.isRefreshing) {
			return this.refreshTokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(jwt => {
					return next?.handle(this.addAuthHeader(request, jwt))
				})
			);
		}
		else {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);
			let refreshToken = this._authService.getRefreshToken();
			let refreshUrl = `${environment.baseUrl}authentication/refresh`;

			return this._http.post<any>(refreshUrl, refreshToken).pipe(
				switchMap((tokens) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next(tokens.accessToken);
					this._authService.setTokens(tokens);

					return next.handle(this.addAuthHeader(request, tokens.accessToken));
				}),
				catchError((error) => this.handleRefreshError(error))
			);
		}

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		const accessToken = this._authService.getAccessToken();
		let authRequest = request;

		if (accessToken != undefined && request.context.get(USE_AUTHENTICATION)) {
			authRequest = this.addAuthHeader(request, accessToken);
		}

		return next.handle(authRequest).pipe(
			catchError(error => this.handleResponseError(error, request, next))
		);
	}
}