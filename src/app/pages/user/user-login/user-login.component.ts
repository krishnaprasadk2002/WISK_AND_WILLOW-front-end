declare var google:any;

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
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

    google.accounts.id.initialize({
      client_id: '591241001232-o2idhtff6qrl68nm9m57tvd7msnua08v.apps.googleusercontent.com',
      callback: (response: any) =>{ this.handleLogin(response)
        console.log(response);
      }
      
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'),{
      theme:'filled_blue',
      size:'large',
      shape:'rectangle',
      width:376
    })
  }

  private decodeToken(token:string){
    return JSON.parse(atob(token.split('.')[1]))
  }

  handleLogin(response:any){
    const payload = this.decodeToken(response.credential)
    this.googleLogin(response.credential)
  }

  googleLogin(token:string){
   this.authService.authGoogleLogin(token).subscribe(
    (response)=>{
      console.log("Google login Successful",response);
      this.router.navigate(['']);
    },error =>{
      console.error("Google login failed",error);
    }
   )
  }



  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.userLogin(email, password).subscribe(
        response => {
           this.toastService.show('Google login successful', 'success'); 
          this.router.navigate(['']);
        },
        error => {
          if (error.status === 403 && error.error.message === 'Account not verified. Please verify your account.') {
            localStorage.setItem('userId', error.error.userId);
            this.router.navigate(['/otp']);
          } else {
            this.toastService.show(error.error.message || "Error during login", 'error');
          }
          console.error("Error during login", error);
        }
      );
    } else {
      this.toastService.show('Form is invalid', 'error');
      console.log('Form is invalid');
    }
  }

}
