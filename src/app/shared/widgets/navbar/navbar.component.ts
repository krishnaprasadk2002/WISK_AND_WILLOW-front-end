import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
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
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user$:any
  isLogged:boolean = false
  isMenuOpen = false;
  isDropdownVisible = false;

  constructor(private http:HttpClient,private route:Router,private toastrService:ToastrService,private store:Store,private authService:AuthServicesService){
  }
  ngOnInit(): void {
    // this.user$ = this.store.select(selectUser);
    // this.store.select(selectUser).subscribe((res:any)=>{
    //   if(res){
    //     this.isLogged = true
    //   }
    // });
    
    if(this.authService.isLoggedIn()==="true"){
      this.isLogged = true  ;
    }else{
      this.isLogged = false;
    }
  }

private baseUrl = environment.baseUrl

 

  

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleDropdown(event: Event) {
    console.log("toggled",this.isDropdownVisible);
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
        this.authService.setLoggedIn('false')
        this.toastrService.show('Logout successful', 'success')
        this.route.navigate(['/login'])
      },error=>{
        console.error('Logout failed', error);
        this.toastrService.show(error.error.message || "Error during logout",'error')
      }
)
  }
}
