import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private http:HttpClient,private route:Router,private toastrService:ToastrService){
  }

private baseUrl = environment.baseUrl

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
    this.http.post(`${this.baseUrl}user/logout`,{}).subscribe(
      response =>{
        console.log('User logged out');
        this.toastrService.show('Logout successful', 'success')
        this.route.navigate(['/login'])
      },error=>{
        console.error('Logout failed', error);
        this.toastrService.show(error.error.message || "Error during logout",'error')
      }
)
  }
}
