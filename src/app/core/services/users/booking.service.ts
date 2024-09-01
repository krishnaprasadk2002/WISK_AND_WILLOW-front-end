import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBooking, IRazorpayOrder } from '../../models/booking.model';
import { BehaviorSubject, Observable } from 'rxjs';




export interface PaymentVerificationResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  private bookingDataSubject = new BehaviorSubject<any>(null);
  bookingData$ = this.bookingDataSubject.asObservable();

  bookPackage(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/createbooking`, bookingdata)
  }

  verifyPayment(paymentData: any): Observable<PaymentVerificationResponse> {
    return this.http.post<PaymentVerificationResponse>(`${this.baseUrl}booking/verifypayment`, paymentData);
  }

  updateBookingStatus(orderId: string, status: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}booking/updateStatus`, { orderId, status });
  }

  setBookingData(data: any) {
    this.bookingDataSubject.next(data);
  }

  clearBookingData() {
    this.bookingDataSubject.next(null);
  }

}
