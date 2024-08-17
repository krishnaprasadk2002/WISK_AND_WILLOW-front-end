import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,AdminSideBarComponent,AdminNavComponent],
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
}
