import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  userRegister(userData: any): Observable<any> {

    return this.http.post(`${this.baseUrl}user/register`, userData);
  }

  verifyOtp(userId: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}user/verify-otp`, { userId, otp })
  }

  resendOtP(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}user/resend-otp`, { email })
  }

  userLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}user/login`, { email, password })
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  authGoogleLogin(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}user/googlelogin`, { token });
  }

  forgotpassword(email:string):Observable<any>{
    return this.http.post(`${this.baseUrl}user/forgot-password`,{email})
  }
  
  resetPassword(newPassword: string, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}user/reset-password`, { password: newPassword, token });
}

tokenVerify():Observable<any>{
  return this.http.get(`${this.baseUrl}user/tokenverify`).pipe(
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
