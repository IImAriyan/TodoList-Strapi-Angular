import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private auth: AuthService = inject(AuthService)
  private router: Router = inject(Router)
  private notyf: Notyf = new Notyf();


  baseUrl: string = environment.apiUrl;


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.baseUrl + '/todos')) {
      const token = this.auth.get("token");
      if (token) {

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 ) {
              this.auth.delete("token")
              this.auth.delete("userID")
              this.router.navigate(['/authentication/login'])
            }
            return throwError(error);
          })
        );

      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notyf.error(`An error occurred while processing your request. ${error.statusText}`);
        return throwError(error);
      })
    )
  }
}
