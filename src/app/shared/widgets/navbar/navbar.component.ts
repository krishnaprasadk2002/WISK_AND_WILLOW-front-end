import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  isDropdownVisible = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown(event: Event) {
    this.isDropdownVisible = !this.isDropdownVisible;
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
    console.log('User logged out'); 
  }
}
