import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-emp-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './emp-nav.component.html',
  styleUrl: './emp-nav.component.css'
})
export class EmpNavComponent {
private employee:EmployeeService = inject(EmployeeService)
private router:Router = inject(Router)
private toast:ToastService=inject(ToastService)

onLogout(): void {
  this.employee.employeeLogout().subscribe(
    response => {
      this.toast.showToast({ severity: 'success', summary: 'Success', detail: 'Logout successful' });
      this.router.navigate(['/employee/login']);
    },
    error => {
      console.error('Logout failed', error);
      this.toast.showToast({ severity: 'success', summary: 'Success', detail: 'Logout failed' });
    }
  );
}
}
