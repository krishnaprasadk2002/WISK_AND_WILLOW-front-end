import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private userService: UserservicesService, private route: Router, private toastr: ToastrService) { }

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
            
            this.userProfile.imageUrl = response.url
            this.closeModal();
            this.loadUserProfile();
          },
          (error) => console.error('Error uploading image', error)
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
        this.toastr.success('Profile updated successfully', 'Success');
        this.route.navigate(['/user-profile']);
      },
      (error) => {
        console.error('Error updating profile', error);
        this.toastr.error('Failed to update profile', 'Error');
      }
    );
  }
}