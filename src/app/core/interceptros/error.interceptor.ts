import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)

  

  return next(req).pipe(
    catchError(error=>{
      console.log(error);
      
      // if(error.status==404 || error.status==500){
      //   router.navigate(['error', error.status]);
      // }
      return throwError(()=>error)
    })
  )

};
