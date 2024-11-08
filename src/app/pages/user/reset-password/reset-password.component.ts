import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/form.validator';
import { CommonModule } from '@angular/common';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  private token!: string;
  private toastService:ToastService = inject(ToastService)

  constructor(private fb:FormBuilder,private router:Router,private authServices:AuthServicesService,private route: ActivatedRoute){ }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token']; 
    console.log('Token from query params:', this.token);

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
        const newPassword = this.resetPasswordForm.value.password;
        this.authServices.resetPassword(newPassword, this.token).subscribe(
            response => {
              const toastOption: IToastOption = {
                severity: 'success', 
                summary: 'Success', 
                detail: 'Password reset successful'
              }
        
              this.toastService.showToast(toastOption); 
                console.log('Password reset successful');
                this.router.navigate(['/login']);
            },
            error => {
              const toastOption: IToastOption = {
                severity: 'error', 
                summary: 'Error', 
                detail: error.error.message || 'Password reset failed',
              }
              this.toastService.showToast(toastOption); 
                console.error('Password reset failed', error);
            }
        );
    } else {
        console.log('Form is invalid');
    }
}


}
