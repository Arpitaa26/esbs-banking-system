import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiGateWayService } from './apiGateway.service';
import { ToastrService } from './toastr.service';
import { SpinnerService } from './spinner.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private apigateway: ApiGateWayService,
    private toast: ToastrService,
    private spinner: SpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        const statusCode = httpError.status;
        const errorBody = httpError.error.message;
        this.toast.error(httpError.error.message || httpError.error.error || 'Something went wrong!')

        if (statusCode === 401 || statusCode === 403) {
          this.apigateway.logout();
          this.toast.error('Session expired or unauthorized access.')
        }
        this.spinner.hide();
        return throwError(() => httpError);
      })
    );
  }
}
