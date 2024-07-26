import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,AdminSideBarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
