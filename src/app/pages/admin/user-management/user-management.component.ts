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
  isSidebarOpen = false;
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 7;
  totalPages = 0;

  constructor(private navServices: AdminNavService, private userService: UserservicesService, private toastr: ToastrService) {
    this.navServices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  toggleSidebar() {
    this.navServices.toggleSidebar();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log(startIndex,endIndex,"kokokok");
    
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  toggleStatus(user: User) {
    user.status = !user.status;

    this.userService.UpdateUser(user).subscribe(
      () => {
        const message = user.status ? 'User blocked successfully' : 'User unblocked successfully';
        this.toastr.success(message);
        this.loadUsers(); 
      },
      error => {
        console.error('Error updating user status:', error);
        this.toastr.error('Failed to update user status');
        user.status = !user.status;
      }
    );
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers(); 
      },
      error => {
        console.error(error);
      }
    );
  }
}
