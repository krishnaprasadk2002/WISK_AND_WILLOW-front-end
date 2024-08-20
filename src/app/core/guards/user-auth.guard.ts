import { CanActivateFn, Router } from '@angular/router';
import { AuthServicesService } from '../services/users/auth-services.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthServicesService)
  const router = inject(Router)

  return authServices.isAuthenticated().pipe(
    map(res=>{
      if(res==true){
      router.navigate(['/'])
      return false
      }else{
       return true
      }
   })
  )
};
