import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './employee-register.component.html',
  styleUrl: './employee-register.component.css'
})
export class EmployeeRegisterComponent implements OnInit {

    registrationForm!: FormGroup;
  private toast:ToastService = inject(ToastService)
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private employee:EmployeeService
    ) {}
  
    ngOnInit(): void {
      this.registrationForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required]],
        type: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }, {
        validator: this.passwordMatchValidator
      });
    }
    
  
    // Custom validator to check if passwords match
    passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { 'mismatch': true };
    }
  
    onSubmit(): void {
      if (this.registrationForm.valid) {
          this.employee.employeeRegister(this.registrationForm.value).subscribe(
              response => {
                this.toast.showToast({ severity: 'success', summary: 'Success', detail: 'Registration successful' });
                  this.router.navigate(['/employee/login']);
              },
              error => {
                this.toast.showToast({ severity: 'error', summary: 'error', detail: error || 'Registration failed' });
                  console.error('Registration failed', error);
              }
          );
      } else {
        this.toast.showToast({ severity: 'warn', summary: 'Warn', detail: 'Please fill all required fields correctly' });
      }
  }  
  }

