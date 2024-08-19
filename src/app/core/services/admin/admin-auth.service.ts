import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../../models/user.model';
import { IEvent } from '../../models/event.model';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
private baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }

adminLogin(email:string,password:string) :Observable<any>{
return this.http.post(`${this.baseUrl}admin/login`,{email,password})
}

adminAllEvents(params: { page: number; limit: number }): Observable<{ event: IEvent[], totalItems: number }> {
  return this.http.get<{ event: IEvent[], totalItems: number }>(`${this.baseUrl}admin/allevents`, {
    params: params,
  });
}

isAuthenticated(): Observable<boolean> {
  return this.http.get(`${this.baseUrl}admin/isAuth`).pipe(
    map(() => true),
    catchError(() => of(false))
  );
}

}
