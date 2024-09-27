import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Employee, LogoutResponse } from '../../models/employee.model';
import { catchError, map, Observable, of} from 'rxjs';
import { LoginResponse } from '../../models/authResponse';
import { IBooking } from '../../models/booking.model';

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

  loadEmployeeData(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}employee/loadempdata`)
  }

  GetBookingData(): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.baseUrl}employee/bookings`);
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}employee/isAuth`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  
}
