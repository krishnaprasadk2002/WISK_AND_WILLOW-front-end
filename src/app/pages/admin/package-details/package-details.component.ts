import { Component, OnInit } from '@angular/core';

import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageService } from '../../../core/services/admin/package.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class PackageDetailsComponent implements OnInit {
  packageId!: string;
  packageData: any;
  status!: boolean;
  isModalOpen: boolean = false;
  packageFeatureForm!: FormGroup;

  constructor(private navServices: AdminNavService, private fb: FormBuilder, private packageService: PackageService, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log("packageId",this.packageId);
    
    this.packageFeatureForm = this.fb.group({
      itemName: ['', Validators.required],
      price: ['', Validators.required],
      status: ['Available', Validators.required]
    })
  }


  toggleSidebar() {
    this.navServices.toggleSidebar()
  }

  openModal(target: string) {
    if (target == 'add') {
      this.isModalOpen = true
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.packageFeatureForm.reset({ status: 'Available' });
  }

  calculateTotalPrice() {

  }


  onSubmit(): void {
    if (this.packageFeatureForm.valid) {
      const formValue = this.packageFeatureForm.value;

      const packageItems = [
        {
          itemName: formValue.itemName,
          price: formValue.price,
          status: formValue.status === 'Available'
        }
      ];

      const packageId = this.packageId;

      this.packageService.addPackageFeatures(packageId, packageItems).subscribe(
        response => {
          console.log('Package features added successfully:', response);
          this.closeModal();
          this.packageFeatureForm.reset({ status: 'Available' });
        },
        error => {
          console.error('Error adding package features:', error);
        }
      );
    }
    }
  }


