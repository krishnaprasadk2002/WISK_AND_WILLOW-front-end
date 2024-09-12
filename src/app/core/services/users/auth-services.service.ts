import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.model';
import { AuthResponse } from '../../models/authResponse';
import { OtpResponse } from '../../models/otp.model';
import { LoginResponse } from '../../models/authResponse';
import { GoogleLoginResponse } from '../../models/authResponse';



@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  userRegister(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}user/register`, userData);
  }

  verifyOtp(userId: string, otp: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse> (`${this.baseUrl}user/verify-otp`, { userId, otp })
  }

  resendOtP(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}user/resend-otp`, { email })
  }

  userLogin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}user/login`, { email, password })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  authGoogleLogin(token: string): Observable<GoogleLoginResponse> {
    return this.http.post<GoogleLoginResponse> (`${this.baseUrl}user/googlelogin`, { token });
  }

  forgotpassword(email:string):Observable<{ message: string }>{
    return this.http.post<{ message: string }>(`${this.baseUrl}user/forgot-password`,{email})
  }
  
  resetPassword(newPassword: string, token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}user/reset-password`, { password: newPassword, token });
}

tokenVerify():Observable<boolean>{
  return this.http.get<boolean>(`${this.baseUrl}user/tokenverify`).pipe(
    catchError((err)=> of(false))
  )
}

isLoggedIn():string | null{
  return localStorage.getItem('isLoggedIn')
}

setLoggedIn(status: string){
  localStorage.setItem('isLoggedIn',status)

}

setLoggout(){
  localStorage.removeItem('isLoggedIn')
}

isAuthenticated(): Observable<boolean> {
  return this.http.get(`${this.baseUrl}user/isAuth`).pipe(
    map(() => true),
    catchError(() => of(false))
  );
}
}
