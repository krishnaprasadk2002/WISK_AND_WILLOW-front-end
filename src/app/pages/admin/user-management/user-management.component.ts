import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReusableTableComponent, AdminNavComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  isSidebarOpen = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  headArray: any[] = [
    { header: "UserName", fieldName: "name", datatype: "string" },
    { header: "Email", fieldName: "email", datatype: "string" },
    { header: "Mobile", fieldName: "mobile", datatype: "string" },
    { header: "Status", fieldName: "status", datatype: "boolean" }
  ]

  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;



  constructor( private userService: UserservicesService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }


  toggleStatus(user: User) {
    user.status = !user.status;

    this.userService.UpdateUser(user).subscribe(
      () => {
        const message = user.status ? 'User blocked successfully' : 'User unblocked successfully';
        this.toastr.success(message);
        this.loadUsers(this.currentPage);
      },
      error => {
        console.error('Error updating user status:', error);
        this.toastr.error('Failed to update user status');
        user.status = !user.status;
      }
    );
  }

  loadUsers(page: number): void {
    this.userService.getUsers(page, this.itemsPerPage).subscribe(
      data => {
        this.users = data.users; 
        this.filteredUsers = data.users;
        this.totalItems = data.totalItems; 
      },
      error => {
        console.error(error);
      }
    );
  }

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase()
    if(searchTerm){
      this.userService.searchUsers(searchTerm).subscribe(
        item => {
          this.filteredUsers = item
        }, error => {
          console.error(error);
  
        }
      )
    }else{
     this.loadUsers(this.currentPage)
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers(page);
  }
}
