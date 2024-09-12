import { Component, Input } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {

  @Input() PageName!: string;

  constructor(private adminNav: AdminNavService,private router:Router) {}

  toggleSidebar() {
    this.adminNav.toggleSidebar();
  }

  navigetToChat(){
   this.router.navigate(['/admin/chat-management'])
  }
}
