import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { Employee } from '../../../core/models/employee.modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-managment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './employee-managment.component.html',
  styleUrl: './employee-managment.component.css'
})
export class EmployeeManagmentComponent implements OnInit {
  isSidebarOpen = false
  employees:Employee[] = []

  constructor(private navServices:AdminNavService ,private emplyeeService:EmployeeService){
    this.navServices.sidebarOpen$.subscribe(isopen =>{
      this.isSidebarOpen = isopen
    })
  }
  ngOnInit(): void {
    this.loadEmployees()
  }

  toggleSidebar(){
    this.navServices.toggleSidebar()
  }

  updateStatus(employee: Employee, status: 'Approved' | 'Rejected') {
    employee.is_employee = status;

    this.emplyeeService.updateStatus(employee).subscribe(
        (updatedEmployee) => {
            console.log('Employee status updated:', updatedEmployee);
        },
        (error) => {
            console.error('Error updating employee status:', error);
        }
    );
}

  loadEmployees(){
   this.emplyeeService.getEmployee().subscribe(
    (employe)=>{
      this.employees = employe
    },(error) => {
      console.error('Error fetching events', error);
    }
   )
  }

}
