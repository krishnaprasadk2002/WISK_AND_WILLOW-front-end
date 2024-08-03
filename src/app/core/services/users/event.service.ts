import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl


  addEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}event/addevent`,eventData )
  }
}
