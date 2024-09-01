import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../core/services/users/booking.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.css'
})
export class PaymentFailureComponent implements OnInit,OnDestroy {
  failureData: any;
  private subscription!: Subscription;

  constructor(private bookingServices:BookingService,private router:Router){}

  ngOnInit(): void {
    this.subscription = this.bookingServices.bookingData$.subscribe(data => {
      if (data) {
        this.failureData = data;
      } else {
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.bookingServices.clearBookingData();
  }

  retryPayment() {
    this.router.navigate(['/booking']);
  }

}
