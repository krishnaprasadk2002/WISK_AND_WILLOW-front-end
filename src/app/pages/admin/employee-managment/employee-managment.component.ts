import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-employee-managment',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './employee-managment.component.html',
  styleUrl: './employee-managment.component.css'
})
export class EmployeeManagementComponent implements OnInit {
  isSidebarOpen = false;
  employees: Employee[] = [];
  
  private toastService: ToastService = inject(ToastService); 

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  updateStatus(employee: Employee, status: 'Approved' | 'Rejected') {
    employee.is_employee = status;

    this.employeeService.updateStatus(employee).subscribe(
      (updatedEmployee) => {
        console.log('Employee status updated:', updatedEmployee);
        this.toastService.showToast({
          severity: 'success',
          summary: 'Success',
          detail: `Employee status updated to ${status}`,
        });
      },
      (error) => {
        console.error('Error updating employee status:', error);
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating employee status',
        });
      }
    );
  }

  loadEmployees() {
    this.employeeService.getEmployee().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching employees',
        });
      }
    );
  }
}
