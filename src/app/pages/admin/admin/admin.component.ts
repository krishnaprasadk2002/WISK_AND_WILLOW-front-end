import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSideBarComponent } from "../../../shared/widgets/admin-side-bar/admin-side-bar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminSideBarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
