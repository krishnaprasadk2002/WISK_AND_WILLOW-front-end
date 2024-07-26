import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/widgets/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [NavbarComponent,RouterOutlet],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {

}
