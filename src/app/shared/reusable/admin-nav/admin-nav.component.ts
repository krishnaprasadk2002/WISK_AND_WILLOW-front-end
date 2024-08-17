import { Component, Input } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {

  @Input() PageName!:string
  constructor(private adminNav:AdminNavService){}

  toggleSidebar(){
    this.adminNav.toggleSidebar()
  }
}
