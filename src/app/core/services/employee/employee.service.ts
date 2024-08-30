import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../models/employee.model';
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
    return this.http.post<any>(`${this.baseUrl}employee/login`, loginData);
  }

  employeeLogout():Observable<any>{
    return this.http.post<any>(`${this.baseUrl}employee/logout`, {})
  }

   getEmployee():Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.baseUrl}employee/getemployees`)
  }
  updateStatus(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}employee/empstatus/${employee._id}`, { is_employee: employee.is_employee });
}


}
