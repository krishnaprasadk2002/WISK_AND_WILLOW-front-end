import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employee, LogoutResponse } from '../../models/employee.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/authResponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.baseUrl
  constructor(private http:HttpClient) { }

   // Register employee
   employeeRegister(employeeData: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}employee/register`, employeeData);
  }

  // Login employee
  employeeLogin(loginData: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}employee/login`, loginData);
  }

  // Logout employee
  employeeLogout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.baseUrl}employee/logout`, {});
  }

  // Get list of employees
  getEmployee(page: number, itemsPerPage: number): Observable<{Employee:Employee[],totalItems:number}> {
    return this.http.get<{Employee:Employee[],totalItems:number}>(`${this.baseUrl}employee/getemployees`,{
      params:{
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }});
  }

  searchEmployee(searchTerm:string):Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.baseUrl}employee/search`,{
      params:{
        searchTerm
      }

    })
  }

  // Update employee status
  updateStatus(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}employee/empstatus/${employee._id}`, { is_employee: employee.is_employee });
  }

}
