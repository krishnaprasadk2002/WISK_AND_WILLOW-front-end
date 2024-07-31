import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {
  isSidebarOpen = false;
  private baseUrl = environment.baseUrl

  constructor(private navServices: AdminNavService, private router: Router, private toastrService: ToastrService, private http: HttpClient) {

    this.navServices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen
    })
  }

  toggleSidebar() {
    this.navServices.toggleSidebar();
  }

  onLogOut() {
    this.http.post(`${this.baseUrl}admin/logout`, {}).subscribe(
      response => {
        console.log('admin logged out');
        this.toastrService.show('Logout successful', 'success');
        this.router.navigate(['/admin/login']);
      },
      error => {
        console.error('Logout failed', error);
        this.toastrService.show(error.error.message || "Error during logout", 'error');
      }
    );
}

}
