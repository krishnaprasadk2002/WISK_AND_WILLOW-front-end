import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserservicesService {
  private baseUrl = environment.baseUrl


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}admin/userdata`)
  }

  UpdateUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}admin/updateUserStaus`, user)
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}user/userprofiledata`)
  }

  profilePicture(image:any):Observable<string>{
    return this.http.post<string>(`${this.baseUrl}user/profilePicture`,image)
  }

  updateProfile(profileData:User):Observable<User>{
    return this.http.put<User>(`${this.baseUrl}user/updateprofile`,profileData)
  }
}
