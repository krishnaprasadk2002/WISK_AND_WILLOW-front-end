import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.css'
})
export class EmployeeLoginComponent {

  private toast:ToastService = inject(ToastService)
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employee: EmployeeService
  
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.employee.employeeLogin(this.loginForm.value).subscribe(
        response => {
          this.toast.showToast({ severity: 'success', summary: 'Success', detail: 'Login successful' });
          this.router.navigate(['/employee/dashboard']);
        },
        error => {
          console.error('Login failed', error);
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.toast.showToast({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      );
    } else {
      this.toast.showToast({severity: 'warn', summary: 'Warn', detail: 'Please fill all required fields correctly'})
    }
  }
  

  onLogout():void{
    this.employee.employeeLogout().subscribe(
      response=>{
        this.toast.showToast({ severity: 'success', summary: 'Success', detail: 'Logout successful' });
        this.router.navigate(['/employee/login']);
      },
      error => {
        console.error('Logout failed', error);
        this.toast.showToast({ severity: 'error', summary: 'Error', detail: error || 'Logout failed'});
      }
    )
  }
}
