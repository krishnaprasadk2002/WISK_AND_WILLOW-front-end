import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  status: boolean = true
  isSidebarOpen = false
  users: User[] = []



  constructor(private navServices: AdminNavService, private userService: UserservicesService) {
    this.navServices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen
    })
  }
  ngOnInit(): void {
    this.loadUser()
  }


  toggleSidebar() {
    this.navServices.toggleSidebar()
  }

  toggleStatus() {
    this.status = !this.status
  }

 private loadUser(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users
      console.log(this.users);
    },error=>{
      console.error(error);
      
    }
    )
  }
}
