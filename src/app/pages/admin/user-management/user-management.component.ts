import { Component } from '@angular/core';
import { AdminNavService } from '../../../core/services/admin-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  status:boolean = true
  isSidebarOpen = false
constructor(private navServices:AdminNavService){
  this.navServices.sidebarOpen$.subscribe(isOpen =>{
    this.isSidebarOpen = isOpen
  })
}

toggleSidebar(){
  this.navServices.toggleSidebar()
}

toggleStatus(){
this.status = !this.status
}
}
