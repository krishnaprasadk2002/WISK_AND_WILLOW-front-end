import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { IBooking } from '../../models/booking.model';


export interface SetUserResponse {
  token: string;
  userData: User;
}

export interface ProfilePictureResponse {
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserservicesService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Get users with pagination
  getUsers(page: number, limit: number): Observable<{ users: User[]; totalItems: number }> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{ users: User[]; totalItems: number }>(`${this.baseUrl}admin/userdata`, { params });
  }

  // Search users
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}admin/search`, {
      params: { searchTerm }
    });
  }

  // Set user data to local storage with proper typing
  setUsertoLocalstorage(response: SetUserResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userdata', JSON.stringify(response.userData));
  }

  // Update user status
  UpdateUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}admin/updateUserStaus`, user);
  }

  // Get user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}user/userprofiledata`);
  }


  profilePicture(image: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}user/profilePicture`, image)
  }

 
  // Update user profile
  updateProfile(profileData: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}user/updateprofile`, profileData);
  }

  // Get booking details based on email
  getBooking(email: string): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.baseUrl}booking/getbookinginprofile`, {
      params: { email }
    });
  }

  saveContact(contactData: { email: string; subject: string; message: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}user/contactsave`, contactData);
  }
  
}
