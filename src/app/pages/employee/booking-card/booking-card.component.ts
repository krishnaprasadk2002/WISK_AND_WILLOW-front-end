import { Component, Input } from '@angular/core';
import { IBooking } from '../../../core/models/booking.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css'
})
export class BookingCardComponent {
  @Input() booking!: IBooking;

  isExpired(): boolean {
    return new Date(this.booking.requested_date) < new Date();
  }
}
