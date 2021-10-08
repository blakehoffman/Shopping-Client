import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(
		private auth: AuthService,
		private http: HttpClient
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

	handleResponseError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		if (error.status != 401) {
			return throwError(error);
		}

		if (this.isRefreshing) {
			return this.refreshTokenSubject
				.pipe(
					filter(token => token != null),
					take(1),
					switchMap(jwt => {
						return next?.handle(this.addAuthHeader(request, jwt))
					}));
		}
		else {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);
			var refreshToken = this.auth.getRefreshToken();
			var refreshUrl = `${environment.baseUrl}authentication/refresh`;

			return this.http.post<any>(refreshUrl, refreshToken)
				.pipe(switchMap((tokens) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next(tokens.accessToken);
					this.auth.setTokens(tokens);

					return next.handle(this.addAuthHeader(request, tokens.accessToken));
				}));
		}

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		const accessToken = this.auth.getAccessToken();
		var authRequest = request;

		if (accessToken != undefined) {
			authRequest = this.addAuthHeader(request, accessToken);
		}

		return next.handle(authRequest).pipe(
			catchError(error => this.handleResponseError(error, request, next))
		);
	}
}