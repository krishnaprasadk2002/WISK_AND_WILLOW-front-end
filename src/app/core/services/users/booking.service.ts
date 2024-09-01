import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBooking } from '../../models/booking.model';
import { Observable } from 'rxjs';

export interface IRazorpayOrder {
  amount: number;         // The total amount for the order in the smallest currency unit (e.g., paise for INR)
  amount_due: number;     // The amount due for the order in the smallest currency unit
  amount_paid: number;    // The amount that has been paid for the order in the smallest currency unit
  attempts: number;       // The number of attempts made for payment
  created_at: number;     // Unix timestamp indicating when the order was created
  currency: string;       // The currency code (e.g., 'INR')
  entity: string;         // The type of entity, usually 'order'
  id: string;             // The unique identifier for the order
  notes: string[];        // Array of notes or additional information associated with the order
  offer_id: string | null; // The offer ID if any offer is applied, otherwise null
  receipt: string;        // The receipt number or identifier for the order
  status: string;         // The status of the order (e.g., 'created', 'paid', 'failed')
}


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  bookPackage(bookingdata: IBooking): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(`${this.baseUrl}booking/createbooking`, bookingdata)
  }

  verifyPayment(paymentData: any) {
    return this.http.post(`${this.baseUrl}booking/verifypayment`, paymentData);
  }

}
