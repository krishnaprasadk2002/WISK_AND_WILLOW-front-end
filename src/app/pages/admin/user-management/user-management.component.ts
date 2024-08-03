import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  isSidebarOpen = false
  users: User[] = []

  constructor(private navServices: AdminNavService, private userService: UserservicesService,private toastr:ToastrService) {
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

  toggleStatus(user:User) {
    user.status= !user.status

    this.userService.UpdateUser(user).subscribe(
      ()=>{
        const message = user.status ? 'User blocked successfully' : 'User unblocked successfully';
        this.toastr.success(message); 
        this.loadUser(); 
      },error =>{
        console.error('Error updating user status:', error);
        this.toastr.error('Failed to update user status');
        user.status = !user.status;
      }
    )
  }

  private loadUser(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users
      console.log(this.users);
    }, error => {
      console.error(error);
    }
    )
  }

}
