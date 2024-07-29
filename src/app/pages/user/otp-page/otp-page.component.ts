import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.css'
})
export class OtpPageComponent implements OnInit {
  otpForm: FormGroup;
  timer: number = 60
  timerInterval: any;
  isLinkDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServicesService,
    private toastService: ToastrService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = 60;
    this.isLinkDisabled = true;
    const interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(interval);
        this.isLinkDisabled = false;
      }
    }, 1000);
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const { otp } = this.otpForm.value;
      const userId = localStorage.getItem('userId');
      this.authService.verifyOtp(userId as string, otp).subscribe(
        response => {
          clearInterval(this.timerInterval);
          this.toastService.show('OTP verified successfully', 'success');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          this.router.navigate(['/login']);
        },
        error => {
          this.toastService.show(error.error.message || 'Invalid OTP', 'error');
          console.error('Error during OTP verification', error);
        }
      );
    } else {
      this.toastService.show('Please enter a valid OTP', 'error');
      console.log('Form is invalid');
    }
  }

  resendOtp() {
    if (this.isLinkDisabled) return;
    const email =localStorage.getItem('email')
    this.authService.resendOtP(email as string).subscribe(
      response => {
        this.toastService.show('OTP resent successfully', 'success');
        this.timer = 60;
        this.startTimer();
      },
      error => {
        this.toastService.show('Error during OTP resend', 'error');
        console.error('Error during OTP resend', error);
      }
    );
  }
}
