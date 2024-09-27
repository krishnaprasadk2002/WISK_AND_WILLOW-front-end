import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { alphabetsOnlyValidator,noWhitespaceValidator,mobileNumberValidator, passwordMatchValidator, strongPasswordValidator } from '../../../shared/validators/form.validator';
import { CommonModule } from '@angular/common';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';


@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  registerForm!: FormGroup;

  private toastService: ToastService = inject(ToastService);
  constructor( private fb: FormBuilder,
    private authService: AuthServicesService,
    private router: Router) {

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, alphabetsOnlyValidator(), noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, mobileNumberValidator()]],
      password: ['', [Validators.required, noWhitespaceValidator(), strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
    }, { validators: passwordMatchValidator });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, mobile, password } = this.registerForm.value;
      const userData = { name: username, email, mobile, password };
      this.authService.userRegister(userData).subscribe(
        response => {

          const toastOption: IToastOption = {
            severity: 'success', 
            summary: 'Success', 
            detail: 'Registration successful'
          }
    
          this.toastService.showToast(toastOption); 
        console.log(response);
        localStorage.setItem('userId',response._id)
        localStorage.setItem('email',response.email)
          this.router.navigate(['/otp']);
        },
        error => {
          const toastOption: IToastOption = {
            severity: 'error', 
            summary: 'Error', 
            detail: error.error.message || "Error during registration"
          }
    
          this.toastService.showToast(toastOption); 
          console.error('Error during registration', error);
        }
      );
    } else {console.log('hai');
    
      this.registerForm.markAllAsTouched()
      const toastOption: IToastOption = {
        severity: 'warn', 
        summary: 'Warn', 
        detail: 'Form is invalid'
      }
      this.toastService.showToast(toastOption); 
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
