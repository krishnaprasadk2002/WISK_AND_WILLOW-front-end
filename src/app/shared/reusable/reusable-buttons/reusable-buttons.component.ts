import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reusable-buttons',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './reusable-buttons.component.html',
  styleUrl: './reusable-buttons.component.css'
})
export class ReusableButtonsComponent {
  @Input() item: any;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showStatus: boolean = false;
  @Input() showInfo: boolean = false;
  @Input() showAssign: boolean = false;
  @Input() showApproveReject: boolean = false;
  
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onStatus = new EventEmitter<any>();
  @Output() onMoreInfo = new EventEmitter<any>();
  @Output() onAssign = new EventEmitter<any>();
  @Output() onApprove = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>()

  editEvent() {
    this.onEdit.emit(this.item);
  }

  deleteEvent() {
    this.onDelete.emit(this.item);
  }

  toggleStatus() {
    this.onStatus.emit(this.item);
  }

  showMoreInfo() {
    this.onMoreInfo.emit(this.item);
  }

  assignEvent() {
    this.onAssign.emit(this.item); 
  }

  approveEmployee() {
    this.onApprove.emit(this.item);
  }

  rejectEmployee() {
    this.onReject.emit(this.item);
  }

}
