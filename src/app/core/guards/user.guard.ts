import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicesService } from '../services/users/auth-services.service';
import { tap } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServicesService)
  const router = inject(Router)

  return authService.isAuthenticated().pipe(
    tap(res=>{
      if(res){
        console.log('true');
        
        return true
      }else{
        router.navigate(['/login']);
        console.log('false');
        return false
      }
    })
  )
};
