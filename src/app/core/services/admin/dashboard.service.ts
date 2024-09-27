import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DailyBooking, IDashboard, MonthlyBooking, YearlyBooking } from '../../models/dashBoard.model';
import { IBooking } from '../../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getDashBoard(): Observable<IDashboard> {
    return this.http.get<IDashboard>(`${this.baseUrl}admin/getdashboard`)
  }

  getMonthlyBookings(): Observable<MonthlyBooking[]> {
    return this.http.get<MonthlyBooking[]>(`${this.baseUrl}admin/monthly-bookings`);
  }

  getDailyBookings(): Observable<DailyBooking[]> {
    return this.http.get<DailyBooking[]>(`${this.baseUrl}admin/daily-bookings`);
  }
  
  getYearlyBookings(): Observable<YearlyBooking[]> {
    return this.http.get<YearlyBooking[]>(`${this.baseUrl}admin/yearly-bookings`);
  }
  

  getBookings(
    startDate: string, endDate: string): Observable<{ bookings: IBooking[] }> {
    const params = { startDate, endDate };
    return this.http.get<{ bookings: IBooking[] }>(`${this.baseUrl}admin/bookings`, { params });
  }

  exportBookings(startDate: string, endDate: string): Observable<Blob> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)

    return this.http.get<Blob>(`${this.baseUrl}admin/export-bookings`, {
      params: params,
      responseType: 'blob' as 'json'
    });
  }

}
