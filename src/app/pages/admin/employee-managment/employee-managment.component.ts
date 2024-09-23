import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ToastService } from '../../../services/toast.service';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';

@Component({
  selector: 'app-employee-managment',
  standalone: true,
  imports: [CommonModule,FormsModule,AdminNavComponent,ReusableTableComponent],
  templateUrl: './employee-managment.component.html',
  styleUrl: './employee-managment.component.css'
})
export class EmployeeManagmentComponent implements OnInit {
  isSidebarOpen = false;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  private toastService: ToastService = inject(ToastService); 
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;

  constructor(private employeeService: EmployeeService) {}

  headArray = [
    { header: "Employee Name", fieldName: "name", datatype: "string" },
    { header: "Email", fieldName: "email", datatype: "string" },
    { header: "Mobile", fieldName: "mobile", datatype: "string" },
    { header: "Specified Type", fieldName: "type", datatype: "string" },
    { header: "Status", fieldName: "is_employee", datatype: "string" }
  ];

  ngOnInit(): void {
    this.loadEmployees(this.currentPage);
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

  loadEmployees(page: number = this.currentPage) {
    this.employeeService.getEmployee(page, this.itemsPerPage).subscribe(
      (response) => {
        console.log('response',response);
        this.employees = response.Employee; 
        console.log('employees',this.employees);
        
        this.filteredEmployees = this.employees;
        this.totalItems = response.totalItems;
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees(this.currentPage);
  }

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase();
    if (searchTerm) {
      this.employeeService.searchEmployee(searchTerm).subscribe(
        (items) => {
          this.filteredEmployees = items;
        }, 
        (error) => {
          console.error('Error searching employees', error);
        }
      );
    } else {
      this.filteredEmployees = this.employees; 
    }
  }
}