import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/users/event.service';
import { IEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  events:IEvent[] = []
  isLoading:boolean=true
constructor(private eventSevice:EventService,private  router:Router){}

  ngOnInit(): void {
    this.loadEvents()
  }

loadEvents(){
this.eventSevice.getEvent().subscribe(
  (event)=>{
    this.events = event
    this.isLoading = false
  },(error)=>{
    (error: any) => console.error('Error fetching events', error)
  }
)
}

navigateToEvent(eventName: string) {
  this.router.navigate(['/events', eventName]);
}

}
