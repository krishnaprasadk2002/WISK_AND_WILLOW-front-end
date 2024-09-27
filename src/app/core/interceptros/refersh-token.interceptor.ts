import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { RefreshTokenService } from '../services/refreshToken/refresh-token.service';
import { inject } from '@angular/core';

export const refershTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const refershTokenService: RefreshTokenService = inject(RefreshTokenService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      
      if((err.status === 401 && err.error.message === "Unauthorized") || (err.status === 403 && err.error.message === "Forbidden")) {
        return refershTokenService.refreshToken().pipe(
          switchMap((res) => {
            return next(req);
          }),
          catchError((err: any) => throwError(err))
        );
      }
      


      return throwError(err);
    })
  );
};
