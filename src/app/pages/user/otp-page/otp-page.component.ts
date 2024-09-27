import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

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
  private toastService: ToastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServicesService,
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

          const toastOption: IToastOption = {
            severity: 'success', 
            summary: 'Success', 
            detail: 'OTP verified successfully'
          }
    
          this.toastService.showToast(toastOption); 
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          this.router.navigate(['/login']);
        },
        error => {
          const toastOption: IToastOption = {
            severity: 'error', 
            summary: 'Error', 
            detail: error.error.message || 'Invalid OTP',
          }
    
          this.toastService.showToast(toastOption); 
          console.error('Error during OTP verification', error);
        }
      );
    } else {
      const toastOption: IToastOption = {
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please enter a valid OTP',
      }

      this.toastService.showToast(toastOption); 
      console.log('Form is invalid');
    }
  }

  resendOtp() {
    if (this.isLinkDisabled) return;
    const email =localStorage.getItem('email')
    this.authService.resendOtP(email as string).subscribe(
      response => {

        const toastOption: IToastOption = {
          severity: 'success', 
          summary: 'Success', 
          detail: 'OTP resent successfully'
        }
  
        this.toastService.showToast(toastOption); 
        this.timer = 60;
        this.startTimer();
      },
      error => {
        const toastOption: IToastOption = {
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error during OTP resend',
        }
        this.toastService.showToast(toastOption); 
        console.error('Error during OTP resend', error);
      }
    );
  }
}
