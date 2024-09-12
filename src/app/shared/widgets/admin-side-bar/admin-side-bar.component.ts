import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


interface MenuItem {
  name: string;
  icon: string;
  link: string;
}


@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})

export class AdminSideBarComponent {
  @Input() PageName!: string;
  isSidebarOpen = true;
  private baseUrl = environment.baseUrl;

  menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', link: '/admin' },
    { name: 'User Management', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', link: '/admin/user-management' },
    { name: 'Booking Management', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/booking-managemnt' },
    { name: 'Event Management', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/event-managemnt' },
    { name: 'Employee Management', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', link: '/admin/employee-managemnt' },
    { name: 'Package Management', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', link: '/admin/package-management' },
    { name: 'Food Management', icon: 'M21 15.9A11.971 11.971 0 0012 21c-5.29 0-9.75-3.462-11-8.205M21 15.9A11.971 11.971 0 0112 3c-5.29 0-9.75 3.462-11 8.205M21 15.9c.74-2.939.31-5.76-1.22-7.56M3 8.1c-.74 2.939-.31 5.76 1.22 7.56', link: '/admin/food-management' },
    { name: 'Gallery Management', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/gallery-management' },
    { name: 'Banner Management', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9', link: '/admin/banner-mangement' },
  ];

  constructor(
    private navServices: AdminNavService,
    private router: Router,
    private toastrService: ToastrService,
    private http: HttpClient
  ) {
    this.navServices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  toggleSidebar() {
    this.navServices.toggleSidebar();
  }

  onLogOut() {
    this.http.post(`${this.baseUrl}admin/logout`, {}).subscribe(
      response => {
        console.log('admin logged out');
        this.toastrService.success('Logout successful');
        this.router.navigate(['/admin/login']);
      },
      error => {
        console.error('Logout failed', error);
        this.toastrService.error(error.error.message || "Error during logout");
      }
    );
  }
}