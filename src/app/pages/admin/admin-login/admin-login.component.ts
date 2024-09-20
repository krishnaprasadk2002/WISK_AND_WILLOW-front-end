import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  adminLogin!: FormGroup;
  private toastService: ToastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.adminLogin.valid) {
      const { email, password } = this.adminLogin.value;
      this.adminAuth.adminLogin(email, password).subscribe(
        (response) => {
          console.log('Admin response', response);

          const toastOption: IToastOption = {
            severity: 'success',
            summary: 'Success',
            detail: 'Admin login successful',
          };
          this.toastService.showToast(toastOption);

          this.router.navigate(['/admin']);
        },
        (error) => {
          const toastOption: IToastOption = {
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error during Admin login',
          };
          this.toastService.showToast(toastOption);
          console.error('Error during Admin login', error);
        }
      );
    } else {
      const toastOption: IToastOption = {
        severity: 'error',
        summary: 'Error',
        detail: 'Form is invalid',
      };
      this.toastService.showToast(toastOption);
      console.log('Form is invalid');
    }
  }
}
