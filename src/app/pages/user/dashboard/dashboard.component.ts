import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { IEvent } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/users/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  events: IEvent[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvent().subscribe(
      (events: IEvent[]) => {
        console.log('Events fetched:', events); 
        this.events = events;
      },
      (error: any) => console.error('Error fetching events', error)
    );
  }
}