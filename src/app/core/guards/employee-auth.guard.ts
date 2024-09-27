import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EmployeeService } from '../services/employee/employee.service';
import { tap } from 'rxjs';

export const employeeAuthGuard: CanActivateFn = (route, state) => {
 const authServices = inject(EmployeeService)
 const router = inject(Router)
 return authServices.isAuthenticated().pipe(
  tap(res=>{
    console.log('auth',res);
    
    if(res){
      return true
    }else{
      router.navigate(['/employee/login']);
      return false
    }
  })
 )
};
