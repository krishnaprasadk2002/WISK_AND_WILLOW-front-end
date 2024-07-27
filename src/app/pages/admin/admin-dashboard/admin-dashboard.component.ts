import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminNavService } from '../../../core/services/admin-nav.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,AdminSideBarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  isSidebarOpen = false;
  constructor(private navService:AdminNavService){}
  
  ngOnInit(): void {
    this.navService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen
    })
  }

  toggleSidebar() {
    this.navService.toggleSidebar();
  }
}
