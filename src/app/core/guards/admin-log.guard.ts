import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin/admin-auth.service';
import { map, tap } from 'rxjs';

export const adminLogGuard: CanActivateFn = (route, state) => {
 const adminServices =inject(AdminAuthService)
 const router =inject(Router)
 return adminServices.isAuthenticated().pipe(
  map(res=>{
     if(res==true){
     router.navigate(['/admin'])
     return false
     }else{
      return true
     }
  })
 )
};
