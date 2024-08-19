import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin/admin-auth.service';
import { tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AdminAuthService)
  const router = inject(Router)
 return authService.isAuthenticated().pipe(
  tap(res=>{
    if(res){
      return true
    }else{
      router.navigate(['/admin/login']);
      return false
    }
  })
 )
};
