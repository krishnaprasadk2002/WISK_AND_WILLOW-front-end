import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/widgets/navbar/navbar.component';
import { FooterComponent } from './shared/widgets/footer/footer.component';
import { HomeComponent } from './pages/user/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,FooterComponent,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WISKANDWILLOW-front_end';
}
