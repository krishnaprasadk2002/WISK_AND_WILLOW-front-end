import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';

@Component({
  selector: 'app-employee-managment',
  standalone: true,
  imports: [CommonModule,FormsModule,AdminNavComponent],
  templateUrl: './employee-managment.component.html',
  styleUrl: './employee-managment.component.css'
})
export class EmployeeManagmentComponent implements OnInit {
  isSidebarOpen = false
  employees:Employee[] = []

  constructor(private emplyeeService:EmployeeService){
  
  }
  ngOnInit(): void {
    this.loadEmployees()
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
