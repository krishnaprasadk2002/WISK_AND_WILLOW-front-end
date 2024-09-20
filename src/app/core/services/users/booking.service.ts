import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBooking, IRazorpayOrder } from '../../models/booking.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';




export interface PaymentVerificationResponse {
  status: string;
}

export interface PaymentData {
  id?:string
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface AssignEmployeeResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  private bookingDataSubject = new BehaviorSubject<IBooking | null>(null);
  bookingData$ = this.bookingDataSubject.asObservable();

  // Booking package
  bookPackage(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/createbooking`, bookingdata);
  }

  // Verify payment
  verifyPayment(paymentData: PaymentData): Observable<PaymentVerificationResponse> {
    return this.http.post<PaymentVerificationResponse>(`${this.baseUrl}booking/verifypayment`, paymentData);
  }

  // Update booking status
  updateBookingStatus(orderId: string, status: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}booking/updateStatus`, { orderId, status });
  }

  // Set booking data with the correct type
  setBookingData(data: IBooking | null) {
    this.bookingDataSubject.next(data);
  }

  // Clear booking data
  clearBookingData() {
    this.bookingDataSubject.next(null);
  }

  // Search booking data
  searchBookingData(searchTerm: string): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.baseUrl}booking/search`, {
      params: { searchTerm }
    });
  }

  // Get bookings with pagination
  getBookings(page: number, itemsPerPage: number): Observable<{ booking: IBooking[]; totalItems: number }> {
    return this.http.get<{ booking: IBooking[]; totalItems: number }>(`${this.baseUrl}booking/getbooking`, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }
    });
  }

  // Book a package from the user profile page
  userprofileBookingPayment(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/creatingorder`, bookingdata);
  }

  // Verify balance payment
  verifyBalancePayment(paymentData: PaymentData): Observable<PaymentVerificationResponse> {
    return this.http.post<PaymentVerificationResponse>(`${this.baseUrl}booking/verifybalancepayment`, paymentData);
  }

  // Get employee details
  getEmployeeDetails(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}employee/getemployee`);
  }

  // Assign employee to booking
  assignEmployeeToBooking(bookingId: string, employeeId: string): Observable<AssignEmployeeResponse> {
    return this.http.post<AssignEmployeeResponse>(`${this.baseUrl}booking/${bookingId}/assign-employee`, { employeeId });
  }

}
