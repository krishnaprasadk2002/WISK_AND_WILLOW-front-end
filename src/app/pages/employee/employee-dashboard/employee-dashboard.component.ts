  import { Component, inject, OnInit } from '@angular/core';
  import { EmployeeService } from '../../../core/services/employee/employee.service';
  import { Employee } from '../../../core/models/employee.model';
import { IBooking } from '../../../core/models/booking.model';
import { BookingCardComponent } from '../booking-card/booking-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
  
  @Component({
    selector: 'app-employee-dashboard',
    standalone: true,
    imports: [BookingCardComponent,CommonModule,FormsModule],
    templateUrl: './employee-dashboard.component.html',
    styleUrl: './employee-dashboard.component.css'
  })
  export class EmployeeDashboardComponentm implements OnInit {
    empId: string | null = null;  
    private employee: EmployeeService = inject(EmployeeService);
  
    EmployeeData: Employee[] = [];
    BookingData:IBooking[]=[]
  
    ngOnInit(): void {
      this.loadEmployee();
      this.getBookingDetails()
    }
  
    loadEmployee() {
      this.employee.loadEmployeeData().subscribe(
        (data: Employee[]) => {  
            this.EmployeeData = data;
        },
        (error: any) => {
          console.error('Error in loadEmployee:', error);
        }
      );
    }

    getBookingDetails() {
      this.employee.GetBookingData().subscribe(
        (data: IBooking[]) => {
          if (data.length > 0) {
            this.BookingData.push(...data);
          } else {
            console.log('No booking event assigned');
            
          }
        },
        (error) => {
          console.error('Error fetching booking details:', error);
        }
      );
    }

    getTotalEvents(): number {
      return this.BookingData.length;
    }
  
    getUpcomingEvents(): number {
      const currentDate = new Date();
      return this.BookingData.filter(booking => new Date(booking.requested_date) >= currentDate).length;
    }
    
    
  }


