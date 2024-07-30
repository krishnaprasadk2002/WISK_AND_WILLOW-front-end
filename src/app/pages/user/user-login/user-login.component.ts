import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { noWhitespaceValidator } from '../../../shared/validators/form.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup

  constructor(private authService: AuthServicesService,
    private fb: FormBuilder, private router: Router, private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value

      this.authService.userLogin(email, password).subscribe(
        response => {
console.log(response);

          this.toastService.show('Login successful', 'success');
          this.router.navigate([''])
        }, error => {
          this.toastService.show(error.error.message || "Error during login", 'error')
          console.error("Error during login", error);
        }
      )
    } else {
      this.toastService.show('Form is invalid', 'error');
      console.log('Form is invalid');
    }
  }
}
