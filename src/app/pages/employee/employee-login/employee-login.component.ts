import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee/employee.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.css'
})
export class EmployeeLoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
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
          this.toastr.success('Login successful');
          this.router.navigate(['/employee/dashboard']);
        },
        error => {
          console.error('Login failed', error);
          this.toastr.error('Login failed');
        }
      );
    } else {
      this.toastr.warning('Please fill all required fields correctly');
    }
  }
}
