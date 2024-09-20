declare var google:any;
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { userLogin } from '../../../shared/store/userLogin/login.model';
import { selectUser } from '../../../shared/store/userLogin/login.selector';
import { Store } from '@ngrx/store';
import * as LoginAction from '../../../shared/store/userLogin/login.actions'
import { AppState } from '../../../shared/store/app.state';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup
  user$: any
  private toastService: ToastService = inject(ToastService);

  constructor(private authService: AuthServicesService,
    private fb: FormBuilder, private router: Router, private store:Store<AppState>
  ) { 
    // this.user$ = this.store.select(selectUser);
    // this.user$.subscribe((res:any)=>{
    //   console.log(res,"RFFDFDFD");
    //   if(res){
    //       this.toastService.success('Login successful');
    //       this.router.navigate(['']);
    //   }
    // });
  
  }

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
      const toastOption: IToastOption = {
        severity: 'success', 
        summary: 'Success', 
        detail: 'Google login successful'
      }

      // this.toastService.showToast(toastOption); 

      this.authService.setLoggedIn('true')
      this.router.navigate(['']);
    },error =>{
      console.error("Google login failed",error);
    }
   )
  }



  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const userData: userLogin = this.loginForm.value;
  //     console.log('Login value is getting', userData);
  //     this.store.dispatch(LoginAction.login({ formData: userData }));
      

  //   } else {
  //     this.toastService.error('Form is invalid');
  //     console.log('Form is invalid');
  //   }
  // }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.userLogin(email, password).subscribe(
        response => {
          //  this.toastService.show('Login successful', 'success'); 
           this.authService.setLoggedIn('true')
          this.router.navigate(['']);
        },
        error => {
          this.authService.setLoggedIn('false')
          if (error.status === 403 && error.error.message === 'Account not verified. Please verify your account.') {
            localStorage.setItem('userId', error.error.userId);
            this.router.navigate(['/otp']);
          } else {
            // this.toastService.show(error.error.message || "Error during login", 'error');
          }
          console.error("Error during login", error);
        }
      );
    } else {
      // this.toastService.show('Form is invalid', 'error');
      console.log('Form is invalid');
    }
  }
}

