import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {

  constructor(private router:Router,private toastr:ToastrService,private employee:EmployeeService){}

  onLogout(): void {
    this.employee.employeeLogout().subscribe(
      response => {
        this.toastr.success('Logout successful');
        this.router.navigate(['/employee/login']);
      },
      error => {
        console.error('Logout failed', error);
        this.toastr.error('Logout failed');
      }
    );
  }
}
