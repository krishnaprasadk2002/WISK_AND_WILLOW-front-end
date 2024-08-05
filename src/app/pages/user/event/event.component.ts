import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { IEvent } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/users/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {
event: IEvent | null = null;
eventName:string | null= null ;
ulServices:string[] = []
constructor(private route:ActivatedRoute,private eventService:EventService){

}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
    this.eventName=param.get('name')
    })
    console.log(this.event);
    if (this.eventName) {
      this.loadEvent(this.eventName);
    } else {
      console.error('Event name is null or undefined');
    }
  }

  loadEvent(name:string):void{
    this.eventService.getEventByName(name).subscribe(
      (event:IEvent)=>{
        this.event = event
        console.log("event",this.event);
        this.ulServices = event.event_features.split(',').map(feature => feature.trim());
      },
      (error) => console.error('Error loading event', error)
    )
  }
}
