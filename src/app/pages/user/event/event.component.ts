import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { IEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {
  event!:string | null
constructor(private route:ActivatedRoute){

}
  ngOnInit(): void {
    this.route.paramMap.subscribe((param)=>{
    this.event=param.get('name')
    })
    console.log(this.event);
  }
}
