import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  show(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }  
  toastClass = ['toast-class'];  
  toastMessage = 'This is a toast';  
  showsToast = false;  

  constructor() { }  

  ngOnInit(): void {    
    setTimeout(() => {      
      this.showsToast = true;    
    }, 2000);  
  }
}
