import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../services/toast.service';
import { UserservicesService } from '../../../core/services/users/userservices.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserservicesService,
    private toastService: ToastService 
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.userService.saveContact(this.contactForm.value).subscribe(
        response => {
          const successToast: IToastOption = {
            severity: 'success',
            summary: 'Message Sent',
            detail: 'Your message has been sent successfully!'
          };
          this.toastService.showToast(successToast); // Show success toast

          this.contactForm.reset();
        },
        error => {
          const errorToast: IToastOption = {
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error sending your message. Please try again.'
          };
          this.toastService.showToast(errorToast); 

          console.error('Error sending message:', error);
        }
      );
    } else {
      const warnToast: IToastOption = {
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.'
      };
      this.toastService.showToast(warnToast); 
    }
  }
}