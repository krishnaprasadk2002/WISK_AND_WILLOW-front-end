import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminNavService {

  constructor(private http:HttpClient) { }

  private sideBarOpenSubject = new BehaviorSubject<boolean>(false)
  sidebarOpen$ = this.sideBarOpenSubject.asObservable();

  toggleSidebar(){
    this.sideBarOpenSubject.next(!this.sideBarOpenSubject.value)
  }
}
