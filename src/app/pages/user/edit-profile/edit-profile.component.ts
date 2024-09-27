import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import IToastOption from '../../../core/models/IToastOptions';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  isOpen = false;
  userProfile: User = {
    userId: '',
    name: '',
    mobile: '',
    imageUrl: 'https://via.placeholder.com/100'
  };
  oldPassword: string = '';
  newPassword: string = '';
  selectedImage: File | null = null;

  private toastService:ToastService = inject(ToastService)
  constructor(private userService: UserservicesService, private route: Router, ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  previewImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.userProfile.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
        console.log(this.userProfile,"usssser");
        
        this.userProfile.imageUrl = profile.imageUrl || 'https://via.placeholder.com/100';
      },
      (error) => console.error('Error fetching user profile', error)
    );
  }

  saveImage(): void {
    if (this.selectedImage) {
      const reader = new FileReader()

      reader.onload = () => {
        const base64String = reader.result as string
        console.log('Base64 string:', base64String);

        const formData = new FormData();
        // formData.append('image', base64String)

        this.userService.profilePicture({image:base64String}).subscribe(
          (response: any) => {
            console.log(response);
            const toastOption: IToastOption = {
              severity: 'success', 
              summary: 'Success', 
              detail: 'Profile Photo updated successfully'
            }
      
            this.toastService.showToast(toastOption); 
            
            this.userProfile.imageUrl = response.url
            this.closeModal();
            this.loadUserProfile();
          },
          
          (error) =>{
            const toastOption: IToastOption = {
              severity: 'error', 
              summary: 'Error', 
              detail: error.error.message || "Error uploading image"
            }
            this.toastService.showToast(toastOption); 
            console.error('Error uploading image', error)
          }
        );
      };

      reader.onerror = (error) => {
        console.error('Error reading file', error);
      };

      reader.readAsDataURL(this.selectedImage);
    }
  }

  saveChanges(): void {
    const updatePayload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      ...this.userProfile
    };

    console.log(updatePayload);
    this.userService.updateProfile(updatePayload).subscribe(
      () => {
        const toastOption: IToastOption = {
          severity: 'success', 
          summary: 'Success', 
          detail: 'Profile updated successfully'
        }
  
        this.toastService.showToast(toastOption); 
        this.route.navigate(['/user-profile']);
      },
      (error) => {
        console.error('Error updating profile', error);
        const toastOption: IToastOption = {
          severity: 'error', 
          summary: 'Error', 
          detail: error.error.message || "Failed to update profile"
        }
        this.toastService.showToast(toastOption); 
      }
    );
  }
}