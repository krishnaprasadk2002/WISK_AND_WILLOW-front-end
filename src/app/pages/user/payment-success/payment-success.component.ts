import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IBooking, IRazorpayOrder } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/users/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit,OnDestroy {
  private subscription!: Subscription;
  
  bookingData!:any
  constructor(private bookingServices:BookingService){}

  ngOnInit(): void {
    this.subscription = this.bookingServices.bookingData$.subscribe(data => {
      if (data) {
        this.bookingData = data;
      }
    })
  }

  ngOnDestroy(): void {
       if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.bookingServices.clearBookingData();
  }
 

  


}
