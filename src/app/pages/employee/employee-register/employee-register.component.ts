import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee/employee.service';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './employee-register.component.html',
  styleUrl: './employee-register.component.css'
})
export class EmployeeRegisterComponent implements OnInit {

    registrationForm!: FormGroup;
    private baseUrl = environment.baseUrl;
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
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
                  this.toastr.success('Registration successful');
                  this.router.navigate(['/employee/login']);
              },
              error => {
                  console.error('Registration failed', error);
                  this.toastr.error('Registration failed');
              }
          );
      } else {
          this.toastr.warning('Please fill all required fields correctly');
      }
  }  
  }

