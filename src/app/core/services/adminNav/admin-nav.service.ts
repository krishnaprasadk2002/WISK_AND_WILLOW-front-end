import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminNavService {

  constructor() { }

  private sideBarOpenSubject = new BehaviorSubject<boolean>(false)
  sidebarOpen$ = this.sideBarOpenSubject.asObservable();

  toggleSidebar(){
    this.sideBarOpenSubject.next(!this.sideBarOpenSubject.value)
  }
}
