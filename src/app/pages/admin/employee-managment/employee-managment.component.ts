import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminNavService } from '../../../core/services/admin-nav.service';

@Component({
  selector: 'app-employee-managment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-managment.component.html',
  styleUrl: './employee-managment.component.css'
})
export class EmployeeManagmentComponent {
  status:boolean = true
  isSidebarOpen = false

  constructor(private navServices:AdminNavService){
    this.navServices.sidebarOpen$.subscribe(isopen =>{
      this.isSidebarOpen = isopen
    })
  }

  toggleSidebar(){
    this.navServices.toggleSidebar()
  }

  toggleStatus(){
    this.status = !this.status
  }

}
