import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private tokenBeingRefreshed = false;
  private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtHelper: JwtHelperService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = request.url;
    if (!url.includes('authentication')) {
      const newRequest = this.appendAccessToken(request);
      return next.handle(newRequest).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleSessionExpiredError(request, next);
          }
          return throwError(error);
        })
      );
    } else if (url.includes('logout')) {
      const newRequest = this.appendAccessToken(request);
      return next.handle(newRequest);
    }
    return next.handle(request);
  }

  private appendAccessToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return request;
  }

  handleSessionExpiredError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken') || '';
    const refresh = localStorage.getItem('refreshToken') || '';
    const tokenExpired = this.jwtHelper.isTokenExpired(token);
    const refreshTokenExpired = this.jwtHelper.isTokenExpired(refresh);
    if (tokenExpired && !refreshTokenExpired) {
      if (!this.tokenBeingRefreshed) {
        this.tokenBeingRefreshed = true;
        this.tokenRefreshSubject.next(null);
        return this.authService.refreshAuthStatus().pipe(
          switchMap((tokens) => {
            this.tokenBeingRefreshed = false;
            this.tokenRefreshSubject.next(tokens.accessToken);
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest);
          })
        );
      } else {
        return this.tokenRefreshSubject.pipe(
          filter((currentToken) => currentToken !== null),
          take(1),
          switchMap(() => {
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest);
          })
        );
      }
    } else {
      localStorage.clear();
      this.router.navigate(['auth/log-in']);
      return next.handle(request);
    }
  }
}
