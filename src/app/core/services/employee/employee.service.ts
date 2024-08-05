import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../models/employee.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.baseUrl
  constructor(private http:HttpClient) { }

  employeeRegister(employeeData: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}employee/register`, employeeData);
  }

  employeeLogin(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}employee/login`, loginData, { withCredentials: true });
  }
}
