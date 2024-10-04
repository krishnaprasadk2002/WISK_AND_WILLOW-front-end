import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/userLogin/login.selector';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    .dropdown {
      transform-origin: top right;
      animation: dropdown 0.2s ease-out;
    }
    
    @keyframes dropdown {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false;
  isMenuOpen = false;
  isDropdownVisible = false;
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private route: Router,
    private toastrService: ToastrService,
    private store: Store,
    private authService: AuthServicesService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn() === "true") {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown(event: Event) {
    this.ngZone.run(() => {
      this.isDropdownVisible = !this.isDropdownVisible;
    });
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userIcon = document.getElementById('userIcon');
    const dropdown = document.querySelector('.dropdown');
    
    if (userIcon && dropdown && !userIcon.contains(target) && !dropdown.contains(target)) {
      this.isDropdownVisible = false;
    }
  }

  logout() {
    this.http.post(`${this.baseUrl}user/logout`, {}).subscribe({
      next: () => {
        this.authService.setLoggedIn('false');
        this.toastrService.show('Logout successful', 'success');
        this.route.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
        this.toastrService.show(error.error.message || "Error during logout", 'error');
      }
    });
  }
}