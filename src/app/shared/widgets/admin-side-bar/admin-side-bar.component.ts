import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavService } from '../../../core/services/admin-nav.service';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {
  isSidebarOpen = false;

  constructor(private navServices:AdminNavService){

    this.navServices.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen
    })
  }

  toggleSidebar() {
    this.navServices.toggleSidebar();
  }
}
