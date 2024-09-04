import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { IBooking } from '../../models/booking.model';


@Injectable({
  providedIn: 'root'
})
export class UserservicesService {
  private baseUrl = environment.baseUrl


  constructor(private http: HttpClient) { }

  getUsers(page: number, limit: number): Observable<{ users: User[], totalItems: number }> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{ users: User[], totalItems: number }>(`${this.baseUrl}admin/userdata`, { params });
  }

  searchUsers(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}admin/search`, {
      params: { searchTerm }
    });
  }

  setUsertoLocalstorage(response: any) {
    localStorage.setItem('token', response.token)
    localStorage.setItem('userdata', JSON.stringify(response.userData))
  }

  UpdateUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}admin/updateUserStaus`, user)
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}user/userprofiledata`)
  }

  profilePicture(image: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}user/profilePicture`, image)
  }

  updateProfile(profileData: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}user/updateprofile`, profileData)
  }

  getBooking(email: string): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.baseUrl}booking/getbookinginprofile`,{
      params:{email}
    });
  }
}
