import { Component, OnInit, inject } from '@angular/core';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { IBooking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/users/booking.service';
import { Employee } from '../../../core/models/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [AdminNavComponent, ReusableTableComponent, CommonModule, FormsModule],
  templateUrl: './booking-management.component.html',
  styleUrl: './booking-management.component.css'
})
export class BookingManagementComponent implements OnInit {

  bookingData: IBooking[] = [];
  filteredBooking: IBooking[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  searchTerm: string = '';
  employees: Employee[] = [];
  selectedBooking: IBooking | null = null;
  isModalOpen = false;

  headArray: any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Email", fieldName: "email", datatype: "string" },
    { header: "Package Name", fieldName: "packageName", datatype: "string" },
    { header: "Type Of Event", fieldName: "type_of_event", datatype: "string" },
    { header: "Event Date", fieldName: "requested_date", datatype: "string" },
    { header: "Payment Method", fieldName: "payment_option", datatype: "string" },
    { header: "Package Price", fieldName: "eventWithoutFoodPrice", datatype: "number" },
    { header: "Food Price", fieldName: "foodPrice", datatype: "number" },
    { header: "Total", fieldName: "totalAmount", datatype: "number" },
    { header: "Paid Amount", fieldName: "nowPayableAmount", datatype: "number" },
    { header: "Balance Amount", fieldName: "balanceAmount", datatype: "number" },
    { header: "Payment Status", fieldName: "status", datatype: "string" },
  ];

  private toastService: ToastService = inject(ToastService);

  constructor(private bookingServices: BookingService) {}

  ngOnInit(): void {
    this.loadBooking(this.currentPage);
    this.getEmployeeDetails();
  }

  // Load booking data
  loadBooking(page: number = this.currentPage) {
    this.bookingServices.getBookings(page, this.itemsPerPage).subscribe(
      (data) => {
        this.bookingData = data.booking;
        this.filteredBooking = data.booking;
        this.totalItems = data.totalItems;
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.toastService.showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching bookings',
        });
      }
    );
  }

  openEmployeeModal(booking: IBooking) {
    this.selectedBooking = booking;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  assignEmployee(employee: any) {
    if (this.selectedBooking && this.selectedBooking._id) {
      const bookingId = this.selectedBooking._id;
      const employeeId = employee._id; 

      this.bookingServices.assignEmployeeToBooking(bookingId, employeeId)
        .subscribe(
          response => {
            this.toastService.showToast({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee assigned successfully',
            });
            this.closeModal(); 
          },
          error => {
            console.error('Error assigning employee', error);
            this.toastService.showToast({
              severity: 'error',
              summary: 'Error',
              detail: 'Error assigning employee',
            });
          }
        );
    } else {
      this.toastService.showToast({
        severity: 'warning',
        summary: 'Warning',
        detail: 'No booking selected or booking ID is missing',
      });
      console.error('No booking selected or booking ID is missing');
    }
  }

  getEmployeeDetails() {
    this.bookingServices.getEmployeeDetails().subscribe(
      (data) => {
        this.employees = data;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBooking(this.currentPage);
  }

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase();
    if (searchTerm) {
      this.bookingServices.searchBookingData(searchTerm).subscribe(
        (item) => {
          this.filteredBooking = item;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.filteredBooking = this.bookingData;
    }
  }
}
