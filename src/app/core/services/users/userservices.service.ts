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
  constructor(private http:HttpClient) { }

  getUsers():Observable<User[]>{
   return this.http.get<User[]>(`${this.baseUrl}admin/userdata`)
  }

}
