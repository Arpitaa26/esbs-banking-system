import { SharedService } from './shared.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, finalize, mergeMap, switchMap, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import * as globals from '../globals';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class ApiGateWayService {
  private activeRequestsCount = 0;
  private clientSecret = environment.clientSecret;
  private application_secret = environment.application_secret;
  private auth_code: any;
  private tokenStatusSubject: ReplaySubject<'fresh' | 'refreshed' | 'generated'> | null = null;
  isLoginStatus: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: SpinnerService,
    private sharedService: SharedService,
    private socketService: SocketService,
  ) { }

  getAuthorizationCode(): Observable<any> {
    const formData = {
      client_secret: this.clientSecret,
      application_secret: this.application_secret
    };

    return this.http.post(globals.codeEndpoint, formData, { headers: this.getHeaders() });
  }

  verifyCode(): Observable<any> {
    const formData = {
      client_secret: this.clientSecret,
      application_secret: this.application_secret,
      auth_code: this.auth_code
    };

    return this.http.post(globals.tokenEndpoint, formData, { headers: this.getHeaders() });
  }

  getRefreshToken(): Observable<any> {
    const formData = {
      refresh_token: localStorage.getItem('hub_refresh_token')
    };

    return this.http.post(globals.refreshTokenEndpoint, formData, { headers: this.getHeaders() });
  }

  generateToken(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.getAuthorizationCode().pipe(
        tap((res: any) => {
          this.auth_code = res.data.auth_code;
        }),
        mergeMap(() => this.verifyCode())
      ).subscribe({
        next: (res: any) => {
          this.storeAuthData(res);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getRefreshData(): Observable<any> {
    return new Observable((observer: Observer<boolean>) => {
      this.getRefreshToken().subscribe({
        next: (response: any) => {
          this.storeAuthData(response);
          this.socketService.updateToken();
          observer.next(true);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  storeAuthData(response: any): void {
    const token = response.data?.auth_token || response.data?.access_token;
    const refresh_token = response.data.refresh_token;

    const rawExpiry = response.data.expiry || response.data.expires_in;
    const rawRefreshExpiry = response.data.refresh_expiry || response.data.refreshExpiry;

    const expiresInMs = Number(rawExpiry);
    const refreshExpiresInMs = Number(rawRefreshExpiry);

    const now = Date.now();
    const authTokenExpiryMillis = (now + expiresInMs).toString();
    const refreshTokenExpiryMillis = (now + refreshExpiresInMs).toString();

    localStorage.setItem('hub_token', token);
    if (refresh_token) {
      localStorage.setItem('hub_refresh_token', refresh_token);
    }

    localStorage.setItem('hub_token_expiry', authTokenExpiryMillis);
    localStorage.setItem('hub_refresh_token_expiry', refreshTokenExpiryMillis);
  }

  getAuthToken() {
    return localStorage.getItem('hub_token');
  }

  private getTokenStatus() {
    const authToken = localStorage.getItem('hub_token');
    const authTokenExpiryMillisStr = localStorage.getItem('hub_token_expiry');
    const refreshTokenExpiryMillisStr = localStorage.getItem('hub_refresh_token_expiry');

    const authTokenExpiryMillis = Number(authTokenExpiryMillisStr);
    const refreshTokenExpiryMillis = Number(refreshTokenExpiryMillisStr);
    const currentTime = new Date().getTime();

    const isAuthExpired = !authToken || currentTime >= authTokenExpiryMillis;
    const isAuthExpiringSoon = authToken && currentTime >= (authTokenExpiryMillis - 10000);
    const isRefreshExpired = currentTime >= refreshTokenExpiryMillis;

    return { authToken, isAuthExpired, isAuthExpiringSoon, isRefreshExpired };
  }

  checkTokenStatus(): Observable<'fresh' | 'refreshed' | 'generated'> {
    /** Return existing observable if a token check is already in progress */
    if (this.tokenStatusSubject) {
      return this.tokenStatusSubject.asObservable();
    }

    /** Create a new ReplaySubject to emit the token status only once */
    this.tokenStatusSubject = new ReplaySubject<'fresh' | 'refreshed' | 'generated'>(1);
    const observer = this.tokenStatusSubject;

    /** Get the current token and expiration status */
    const { authToken, isAuthExpired, isRefreshExpired } = this.getTokenStatus();

    /** If no auth token is available, generate a new one */
    if (!authToken) {
      this.generateToken().subscribe({
        next: () => {
          observer.next('generated');
          observer.complete();
        },
        error: err => {
          observer.error(err);
          this.tokenStatusSubject = null;
        }
      });
    }

    /** If auth token expired but refresh token is still valid, refresh the token */
    else if (isAuthExpired && !isRefreshExpired) {
      this.getRefreshData().subscribe({
        next: () => {
          observer.next('refreshed');
          observer.complete();
        },
        error: err => {
          observer.error(err);
          this.tokenStatusSubject = null;
        }
      });
    }

    /** If both tokens are expired, logout and notify session end */
    else if (isAuthExpired && isRefreshExpired) {
      this.logout();
      observer.error(new Error('Session expired. Please Try again.'));
      this.tokenStatusSubject = null;
    }

    /** If token is still valid, emit as 'fresh' */
    else {
      observer.next('fresh');
      observer.complete();
    }

    /** Clean up the ReplaySubject once the observable completes or errors */
    observer.subscribe({
      complete: () => {
        this.tokenStatusSubject = null;
      },
      error: () => {
        this.tokenStatusSubject = null;
      }
    });

    return observer.asObservable();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  private getHeaders(): { [header: string]: string } {
    const authToken = localStorage.getItem('hub_token');
    const headers: { [header: string]: string } = {
      'x-api-category': 'hub'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }

  private performHttpRequest<T>(method: string, url: string, headers: any, data?: any): Observable<T> {
    switch (method) {
      case 'GET':
        return this.http.get<T>(url, { headers });
      case 'POST':
        return this.http.post<T>(url, data, { headers });
      case 'PUT':
        return this.http.put<T>(url, data, { headers });
      default:
        return throwError(() => new Error('Unsupported HTTP method'));
    }
  }

  private makeRequest<T>(method: string, endpoint: string, data?: any): Observable<T> {
    const url = `${globals.apiUrl}/${endpoint}`;
    const headers = this.getHeaders();

    return this.performHttpRequest<T>(method, url, headers, data).pipe(
      catchError((err) => {
        if (err.status === 401) {
          const { isRefreshExpired } = this.getTokenStatus();

          if (isRefreshExpired) {
            this.logout();
            return throwError(() => new Error('Session expired. Please Try again.'));
          }

          return this.getRefreshData().pipe(
            switchMap(() => {
              const retryHeaders = this.getHeaders();
              return this.performHttpRequest<T>(method, url, retryHeaders, data);
            }),
            catchError(() => {
              this.logout();
              return throwError(() => new Error('Session expired. Please Try again.'));
            })
          );
        }

        return throwError(() => new Error(err.error.message || 'Oops! Something went wrong.'));
      }),
      finalize(() => this.endRequest())
    );
  }


  get(endpoint: string): Observable<any> {
    this.startRequest();
    return this.apiServiceWithTokenCheck('GET', endpoint);
  }

  post(endpoint: string, data: any): Observable<any> {
    this.startRequest();
    return this.apiServiceWithTokenCheck('POST', endpoint, data);
  }

  put(endpoint: string, data: any): Observable<any> {
    this.startRequest();
    return this.apiServiceWithTokenCheck('PUT', endpoint, data);
  }

  private apiServiceWithTokenCheck(method: string, endpoint: string, data?: any): Observable<any> {
    return this.checkTokenStatus().pipe(
      switchMap(() => this.makeRequest<any>(method, endpoint, data)),
      catchError(err => {
        this.endRequest();
        return throwError(() => err);
      })
    );
  }

  private startRequest(): void {
    this.activeRequestsCount++;
    if (this.activeRequestsCount === 1) {
      this.spinner.show();
    }
  }

  private endRequest(): void {
    this.activeRequestsCount = Math.max(0, this.activeRequestsCount - 1);

    if (this.activeRequestsCount === 0) {
      this.spinner.hide();
    }
  }
}
