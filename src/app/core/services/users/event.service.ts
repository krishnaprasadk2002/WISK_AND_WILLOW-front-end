import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEvent } from '../../models/event.model';
import { IBanner } from '../../models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl


  addEvent(eventData: IEvent): Observable<IEvent> {
    return this.http.post<IEvent>(`${this.baseUrl}event/addevent`,eventData )
  }

  updateEvent(eventData: IEvent): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}event/editevent`, eventData);
  }

  getEvent():Observable<IEvent[]>{
    return this.http.get<IEvent[]>(`${this.baseUrl}event/getevents`)
  }

  getEventByName(name:string):Observable<IEvent>{
    return this.http.get<IEvent>(`${this.baseUrl}event/getEventByName/${name}`)
  }

  updateEventStatus(event: IEvent): Observable<IEvent> {
    return this.http.post<IEvent>(`${this.baseUrl}event/eventstatus`, event);
  }  

  searchEvent(searchTerm:string):Observable<IEvent[]>{
    return this.http.get<IEvent[]>(`${this.baseUrl}event/search`,{
      params: { searchTerm }
    })
  }

  getBanners():Observable<IBanner[]>{
    return this.http.get<IBanner[]>(`${this.baseUrl}event/getbanners`)
  }
}
