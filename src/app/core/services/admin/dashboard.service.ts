import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IDashboard, MonthlyBooking } from '../../models/dashBoard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

  getDashBoard():Observable<IDashboard>{
   return this.http.get<IDashboard>(`${this.baseUrl}admin/getdashboard`)
  }

  getMonthlyBookings(): Observable<MonthlyBooking[]> {
    return this.http.get<MonthlyBooking[]>(`${this.baseUrl}admin/monthly-bookings`);
  }
}
