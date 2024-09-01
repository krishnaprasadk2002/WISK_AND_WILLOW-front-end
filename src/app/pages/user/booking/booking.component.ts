import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/users/event.service';
import { IEvent } from '../../../core/models/event.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { User } from '../../../core/models/user.model';
import { noWhitespaceValidator } from '../../../shared/validators/form.validator';
import { BookingService } from '../../../core/services/users/booking.service';

declare var Razorpay:any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,InputboxComponent,ButtonComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  bookingForm!: FormGroup;
  paymentOption:string[]=['Advance','Full']
  eventNames: string[] = [];
  isLoading = false;
  userData:User ={
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

  constructor(private fb:FormBuilder,private router:Router,private eventService:EventService,private userService:UserservicesService,private bookingServices:BookingService){}

   ngOnInit(): void {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email, noWhitespaceValidator()]],
      mobile: ['', [Validators.required, noWhitespaceValidator()]],
      packageName: ['', [Validators.required, noWhitespaceValidator()]],
      type_of_event: ['', Validators.required],
      requested_date: ['', Validators.required],
      payment_option: ['', Validators.required],
    });

    this.bookingForm.get('payment_option')?.valueChanges.subscribe(() => {
      this.calculatePayments();
    });

    this.loadTypeOfEvent()
    this.loadBookingData()
    this.loadUserData()
  }

  loadTypeOfEvent(){
  this.eventService.getEvent().subscribe(
    (data:IEvent[])=>{
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
        cart: parsedData.cart || [],
        packageDetails: parsedData.packageDetails,
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
      };

      console.log('Booking submitted:', bookingData);
     this.bookingServices.bookPackage(bookingData).subscribe(data=>{
        console.log(data,"Booking Backend");
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
        console.log(response,"Before");
        
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
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any) {
    console.log(response,"ress");
    
    this.bookingServices.verifyPayment({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe(
      (res) => {
        console.log('Payment verified successfully', res);
        this.router.navigate([''])
        this.isLoading = false;
      },
      (error) => {
        console.error('Error verifying payment', error);
        this.isLoading = false;
      }
    );
  }
}
