import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { alphabetsOnlyValidator,noWhitespaceValidator,mobileNumberValidator, passwordMatchValidator } from '../../../shared/validators/form.validator';
import { CommonModule } from '@angular/common';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  registerForm!: FormGroup;

  constructor( private fb: FormBuilder,
    private authService: AuthServicesService,
    private router: Router,
    private toastService:ToastrService) {

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, alphabetsOnlyValidator(), noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, mobileNumberValidator()]],
      password: ['', [Validators.required, noWhitespaceValidator()]],
      confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
    }, { validators: passwordMatchValidator });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, mobile, password } = this.registerForm.value;
      const userData = { name: username, email, mobile, password };
      this.authService.userRegister(userData).subscribe(
        response => {
          this.toastService.show('Registration successful', 'success');
        console.log(response);
        localStorage.setItem('userId',response._id)
        localStorage.setItem('email',response.email)
          this.router.navigate(['/otp']);
        },
        error => {
          this.toastService.show(error.error.message || 'Error during registration', 'error');
          console.error('Error during registration', error);
        }
      );
    } else {
      this.toastService.show('Form is invalid', 'error');
      console.log('Form is invalid');
    }
  }

  // Helper method to check if a control has a specific error
  hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  // Helper method to check if the form group has a specific error
  hasFormError(errorName: string) {
    return this.registerForm.hasError(errorName);
  }
}
