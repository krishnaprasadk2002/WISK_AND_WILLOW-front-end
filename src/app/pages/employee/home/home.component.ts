import { Component } from '@angular/core';
import { EmpNavComponent } from '../../../shared/widgets/emp-nav/emp-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EmpNavComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeEmployeeComponent {

}
