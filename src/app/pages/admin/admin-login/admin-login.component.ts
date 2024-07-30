import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  adminLogin!: FormGroup

  constructor(private fb: FormBuilder, private adminAuth: AdminAuthService, private router: Router, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.adminLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  onSubmit() {
    if (this.adminLogin.valid) {
      const { email, password } = this.adminLogin.value
      this.adminAuth.adminLogin(email, password).subscribe(
        Response => {
          console.log("admin response",Response);
          this.toastService.show('Admin login successful', 'success')
          this.router.navigate(['/admin'])
        }, error => {
          this.toastService.show(error.error.message || 'Error during Adminlogin', 'error')
          console.error('Error during Adminlogin', error);
        })
    } else {
      this.toastService.show('Form is invalid', 'error');
      console.log('Form is invalid');
    }

  }
}

