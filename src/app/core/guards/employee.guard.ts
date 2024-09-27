import { CanActivateFn, Router } from '@angular/router';
import { EmployeeService } from '../services/employee/employee.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const employeeGuard: CanActivateFn = (route, state) => {
  const authServices = inject(EmployeeService)
 const router = inject(Router)
 return authServices.isAuthenticated().pipe(
  map(res=>{
    console.log('emp Gurd',res);
    
   if(res==true){
    router.navigate(['/employee/dashboard'])
    return false
   }else{
    return true
   }
  })
 )
};
