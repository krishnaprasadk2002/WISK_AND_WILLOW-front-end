import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/users/event.service';
import { IEvent } from '../../../core/models/event.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { User } from '../../../core/models/user.model';
import { noWhitespaceValidator } from '../../../shared/validators/form.validator';
import { BookingService } from '../../../core/services/users/booking.service';

declare var Razorpay: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, InputboxComponent, ButtonComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  bookingForm!: FormGroup;
  paymentOption: string[] = ['Advance', 'Full']
  eventNames: string[] = [];
  isLoading = false;
  userData: User = {
    name: '',
    email: '',
    mobile: '',
  }
  totalAmount: number = 0;
  eventWithoutFoodPrice: number = 0;
  foodPrice: number = 0;
  advancePayment: number = 0;
  balanceAmount: number = 0;
  nowPayableAmount: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private eventService: EventService, private userService: UserservicesService, private bookingServices: BookingService) { }

  private initCartItem(item?: any): FormGroup {
    return this.fb.group({
      food: this.fb.group({
        _id: [item?.food._id || ''],
        name: [item?.food.name || '', Validators.required],
        category: [item?.food.category || '', Validators.required],
        pricePerPlate: [item?.food.pricePerPlate || 0, Validators.required]
      }),
      quantity: [item?.quantity || 1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email, noWhitespaceValidator()]],
      mobile: ['', [Validators.required, noWhitespaceValidator()]],
      packageName: ['', [Validators.required, noWhitespaceValidator()]],
      type_of_event: ['', Validators.required],
      requested_date: ['', Validators.required],
      payment_option: ['', Validators.required],
      cart: this.fb.array([]),
    });

    this.bookingForm.get('payment_option')?.valueChanges.subscribe(() => {
      this.calculatePayments();
    });

    this.loadTypeOfEvent()
    this.loadBookingData()
    this.loadUserData()
  }

  loadTypeOfEvent() {
    this.eventService.getEvent().subscribe(
      (data: IEvent[]) => {
        this.eventNames = data.map(event => event.name)
      },
      error => {
        console.error('Error loading events:', error);
      })
  }

  loadBookingData() {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      this.eventWithoutFoodPrice = parsedData.packageDetails.startingAt || 0;
      this.totalAmount = parsedData.totalAmount;
      this.foodPrice = this.totalAmount - this.eventWithoutFoodPrice;

      this.bookingForm.patchValue({
        packageName: parsedData.packageDetails.name,
        type_of_event: parsedData.packageDetails.type_of_event,
        packageDetails: parsedData.packageDetails,
      });


      const cartArray = this.bookingForm.get('cart') as FormArray;
      parsedData.cart.forEach((item: any) => {
        cartArray.push(this.initCartItem(item));
      });

      this.calculatePayments();
    }
  }


  loadUserData() {
    this.userService.getUserProfile().subscribe(
      (userData: User) => {
        this.userData = userData;

        this.bookingForm.patchValue({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
        });
      },
      (error) => {
        console.error('Error fetching User Data', error);
      }
    );
  }

  calculatePayments() {
    const paymentOption = this.bookingForm.get('payment_option')?.value;
    if (paymentOption === 'Advance') {
      this.advancePayment = this.totalAmount * 0.1;
      this.balanceAmount = this.totalAmount - this.advancePayment;
      this.nowPayableAmount = this.advancePayment;
    } else {
      this.advancePayment = this.totalAmount;
      this.balanceAmount = 0;
      this.nowPayableAmount = this.totalAmount;
    }
  }

  onSubmitBooking() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      const bookingData = {
        ...this.bookingForm.value,
        totalAmount: this.totalAmount,
        eventWithoutFoodPrice: this.eventWithoutFoodPrice,
        foodPrice: this.foodPrice,
        advancePayment: this.advancePayment,
        balanceAmount: this.balanceAmount,
        nowPayableAmount: this.nowPayableAmount,
      };

      this.bookingServices.bookPackage(bookingData).subscribe(data => {
        this.payNow(data.id);

      })
    } else {
      console.log('Form is not valid');
    }
  }

  payNow(orderid: string) {
    const nowPayableAmount = this.nowPayableAmount
    const options = {
      key: 'rzp_test_dUJLoJPD7rBTvA',
      amount: nowPayableAmount,
      currency: 'INR',
      name: 'WISK AND WILLOW',
      description: 'Booking Payment',
      order_id: orderid,
      handler: (response: any) => {
        console.log(response, "Before");

        this.verifyPayment(response);
      },
      prefill: {
        name: this.bookingForm.get('name')?.value,
        email: this.bookingForm.get('email')?.value,
        contact: this.bookingForm.get('mobile')?.value,
      },
      theme: {
        color: '#3a4ade',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment popup closed');
          this.updateBookingStatus(orderid, 'failed');
          this.handlePaymentFailure(orderid, 'Payment cancelled by user');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      this.updateBookingStatus(orderid, 'failed');
      this.handlePaymentFailure(orderid, response.error.description);
    });
  }

 
  verifyPayment(response: any): void {
    this.bookingServices.verifyPayment({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe({
      next: (res) => {
        if (res.status === 'success') {

          const successData = {
            bookingId: response.razorpay_order_id,
            eventName: this.bookingForm.get('type_of_event')?.value,
            customerName: this.bookingForm.get('name')?.value,
            totalAmount: this.totalAmount,
            paymentOption: this.bookingForm.get('payment_option')?.value,
            paidAmount: this.nowPayableAmount,
            balanceAmount: this.balanceAmount,
            paymentId: response.razorpay_payment_id
          };

          this.bookingServices.setBookingData(successData);
          this.router.navigate(['/payment-success']);
        } else {
          console.error('Payment verification failed', res);
          this.handlePaymentFailure(response.razorpay_order_id, 'Payment verification failed');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error verifying payment', error);
        this.handlePaymentFailure(response.razorpay_order_id, 'Error verifying payment');
        this.isLoading = false;
      }
    });
  }

  handlePaymentFailure(orderId: string, errorMessage: string) {
    this.updateBookingStatus(orderId, 'failed');
    
    const failureData = {
      bookingId: orderId,
      eventName: this.bookingForm.get('type_of_event')?.value,
      amount: this.nowPayableAmount,
      errorMessage: errorMessage
    };
    
    this.bookingServices.setBookingData(failureData);
    this.router.navigate(['/payment-failure']);
  }

  updateBookingStatus(orderId: string, status: string) {
    this.bookingServices.updateBookingStatus(orderId, status).subscribe(
      () => {
        console.log(`Booking status updated to ${status}`);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error updating booking status:', error);
        this.isLoading = false;
      }
    );

  }
}
