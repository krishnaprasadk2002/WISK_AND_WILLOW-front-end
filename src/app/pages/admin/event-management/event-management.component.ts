import { Component } from '@angular/core';
import { AdminNavService } from '../../../core/services/admin-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-management.component.html',
  styleUrl: './event-management.component.css'
})
export class EventManagementComponent {

  status:boolean = true;
  isSidebarOpen = false;
constructor(private navservices:AdminNavService){
  this.navservices.sidebarOpen$.subscribe(isOpen=>{
    this.isSidebarOpen = isOpen
  })
}

toggleSidebar(){
  this.navservices.toggleSidebar()
}

toggleStatus(){
  this.status = !this.status
}
}
