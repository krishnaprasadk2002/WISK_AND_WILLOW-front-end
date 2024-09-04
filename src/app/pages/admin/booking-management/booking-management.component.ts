import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { IBooking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/users/booking.service';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [AdminNavComponent,ReusableTableComponent],
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

  constructor(private bookingServices: BookingService) { }

  ngOnInit(): void {
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


  loadBooking(page: number = this.currentPage) {
    this.bookingServices.getBookings(page, this.itemsPerPage).subscribe(
      (data) => {
        this.bookingData = data.booking;
        this.filteredBooking = data.booking;
        this.totalItems = data.totalItems;
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page; 
    this.loadBooking(this.currentPage); 
  }
}