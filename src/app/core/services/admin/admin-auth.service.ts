import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
private baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }

adminLogin(email:string,password:string) :Observable<any>{
return this.http.post(`${this.baseUrl}admin/login`,{email,password})
}

adminAllEvents():Observable<any>{
  return this.http.get(`${this.baseUrl}admin/allevents`,{})
}
}
