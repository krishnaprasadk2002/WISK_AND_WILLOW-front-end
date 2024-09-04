import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { User } from '../../../core/models/user.model';
import { IBooking } from '../../../core/models/booking.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/users/booking.service';

declare var Razorpay: any;

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userProfile: User = {
    name: '',
    email: '',
    mobile: '',
    imageUrl: ''
  }

  bookingData: IBooking[] = [];
  showBookingData: boolean = false;
  isLoading: boolean = false;

  constructor(private userServices: UserservicesService, private bookingServices: BookingService, private router: Router) { }
  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.userServices.getUserProfile().subscribe(
      (profile) => {
        console.log(profile);
        this.userProfile = profile;

        if (this.userProfile.email) {
          this.loadBooking(this.userProfile.email);
        } else {
          console.error('User email is not defined');
        }
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  loadBooking(email: string): void {
    this.userServices.getBooking(email).subscribe(
      (data: IBooking[]) => {
        this.bookingData = data;
        console.log('Booking data:', this.bookingData);
      },
      (error) => {
        console.error('Error fetching booking data', error);
      }
    );
  }
  toggleBookingData() {
    this.showBookingData = !this.showBookingData;
  }

  payBalance(booking: IBooking) {
    const isFullyPaid = booking.balanceAmount <= 0;
    this.bookingServices.userprofileBookingPayment(booking).subscribe(
      data => {
        console.log('new booking data', data);
  
        const amountToPay = isFullyPaid ? booking.totalAmount : booking.balanceAmount;
        const description = isFullyPaid ? 'Full Payment' : 'Balance Payment';
  
        const options = {
          key: 'rzp_test_dUJLoJPD7rBTvA',
          amount: amountToPay,
          currency: 'INR',
          name: 'WISK AND WILLOW',
          description: description,
          order_id: data.id,
          handler: (response: any) => {
            console.log('Payment response:', response);
            this.verifyBalancePayment(response, booking, isFullyPaid,data._id);
          },
          prefill: {
            name: booking.name,
            email: booking.email,
            contact: booking.mobile,
          },
          theme: {
            color: '#3a4ade',
          },
          modal: {
            ondismiss: () => {
              console.log('Payment popup closed');
            }
          }
        };
  
        const rzp = new Razorpay(options);
        rzp.open();
  
        rzp.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response.error);
        });
      },
      error => {
        console.error('Error creating order:', error);
      }
    );
  }
  
  verifyBalancePayment(response: any, booking: IBooking, isFullyPaid: boolean,id:string): void {
    this.bookingServices.verifyBalancePayment({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      id
    }).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const successData = {
            eventName: booking.type_of_event,
            customerName: booking.name,
            totalAmount: booking.totalAmount,
            paymentOption: 'Fully Paid',
            paidAmount: booking.totalAmount,
            balanceAmount: 0,
            paymentId: response.razorpay_payment_id
          };
  
          this.bookingServices.setBookingData(successData);
          this.router.navigate(['/payment-success']);
        } else {
          console.error('Payment verification failed', res);
        }
      },
      error: (error) => {
        console.error('Error verifying payment', error);
      }
    });
  }
  
}
