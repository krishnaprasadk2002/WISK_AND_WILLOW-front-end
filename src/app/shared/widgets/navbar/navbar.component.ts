import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  isDropdownVisible = false;

  toggleMenu() {
    console.log('Toggle menu clicked!'); 
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userIcon = document.getElementById('userIcon');

    if (userIcon && !userIcon.contains(target) && this.isDropdownVisible) {
      this.isDropdownVisible = false;
    }
  }

  logout() {
    console.log('User logged out'); 
  }
  

}
