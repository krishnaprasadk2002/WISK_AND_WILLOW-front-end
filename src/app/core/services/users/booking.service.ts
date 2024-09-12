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

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  private bookingDataSubject = new BehaviorSubject<IBooking | null>(null);
  bookingData$ = this.bookingDataSubject.asObservable();

  bookPackage(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/createbooking`, bookingdata)
  }

  verifyPayment(paymentData: PaymentData): Observable<PaymentVerificationResponse> {
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

  searchBookingData(searchTerm:string):Observable<IBooking[]>{
    return this.http.get<IBooking[]>(`${this.baseUrl}booking/search`,{
      params:{searchTerm}
    })
  }

  getBookings(page:number,itemsPerPage:number):Observable<{booking:IBooking[],totalItems:number}>{
    return this.http.get<{booking:IBooking[],totalItems:number}>(`${this.baseUrl}booking/getbooking`,{
      params:{
        page:page.toString(),
        itemsPerPage:itemsPerPage.toString()
      }
    })
  }

  
  userprofileBookingPayment(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/creatingorder`, bookingdata)
  }

  verifyBalancePayment(paymentData: PaymentData): Observable<PaymentVerificationResponse> {
    return this.http.post<PaymentVerificationResponse>(`${this.baseUrl}booking/verifybalancepayment`, paymentData);
  }

  getEmployeeDetails():Observable<Employee[]>{
   return this.http.get<Employee[]>(`${this.baseUrl}employee/getemployee`)
  }

  assignEmployeeToBooking(bookingId: string, employeeId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}booking/${bookingId}/assign-employee`, { employeeId });
  }

}
