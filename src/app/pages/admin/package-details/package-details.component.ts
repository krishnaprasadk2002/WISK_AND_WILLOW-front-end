import { Component, OnInit } from '@angular/core';

import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageService } from '../../../core/services/admin/package.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Ipackages } from '../../../core/models/packages.model';

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
  packageDetails!: Ipackages 
  totalAmount: number = 0;
  editFeatureId!: string | null; 
  isModalEditOpen:boolean = false
  packageFeatureEditForm!:FormGroup

  constructor(private navServices: AdminNavService, private fb: FormBuilder, private packageService: PackageService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.packageId = params.id
    })

    this.getPackageById()

    this.packageFeatureForm = this.fb.group({
      itemName: ['', Validators.required],
      price: ['', Validators.required],
      status: ['Available', Validators.required]
    })

    this.packageFeatureEditForm = this.fb.group({
      itemName: ['', Validators.required],
      price: ['', Validators.required],
      status: ['Available', Validators.required]
    })
  }


  toggleSidebar() {
    this.navServices.toggleSidebar()
  }

  openModal(target: string,featureId?: string) {
    if (target == 'add') {
      this.isModalOpen = true
    }else if(target == 'edit' && featureId){
      this.isModalEditOpen = true
      this.populateFormForEdit(featureId);
    }
  }

  populateFormForEdit(featureId: string) {
    this.editFeatureId = featureId;
    const feature = this.packageDetails?.packageItems?.find(item => item._id === featureId);
    
    if (feature) {
      this.packageFeatureEditForm.patchValue({
        itemName: feature.itemName,
        price: feature.price,
        status: feature.status ? 'Available' : 'Not Available'
      });
    }
  }
  
  

  closeModal() {
    this.isModalOpen = false;
    this.isModalEditOpen = false
    this.packageFeatureForm.reset({ status: 'Available' });
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
          this.toastr.success('Features added successfully');
          console.log('Package features added successfully:', response);
          this.closeModal();
          this.packageFeatureForm.reset({ status: 'Available' });
          this.getPackageById();
        },
        error => {
          console.error('Error adding package features:', error);
          this.toastr.error('Error adding feature');
        }
      );
    }
  }


  onEditSubmit(): void {
    if (this.packageFeatureEditForm.valid && this.editFeatureId) {
      const formValue = this.packageFeatureEditForm.value;
      const featureData = {
        _id: this.editFeatureId,
        ...formValue,
        status: formValue.status === 'Available'
      };

      this.packageService.editPackageFeature(this.packageId, featureData).subscribe(
        response => {
          console.log('Feature updated successfully:', response);
          this.closeModal();
          this.toastr.success('Feature updated successfully');
          this.getPackageById();
        },
        error => {
          console.error('Error updating feature:', error);
          this.toastr.error('Error updating feature');
        }
      );
    } else {
      this.toastr.error('Form is invalid or feature ID is missing');
    }
  }
  
  getPackageById() {
    this.packageService.getPackageFeaturesById(this.packageId).subscribe(
      (packageFeatureData) => {
        this.packageDetails = packageFeatureData
        this.totalAmount = this.calculateTotalPrice();
        console.log(this.packageDetails.packageItems);
        
      }, error => {
        console.error("geting packageFeature have an issue", error);

      }
    )
  }

  calculateTotalPrice(): number {
    if (this.packageDetails && this.packageDetails.packageItems) {
      return this.packageDetails.packageItems
        .map(item => Number(item.price)) 
        .reduce((acc, price) => acc + price, 0);
    }
    return 0;
  }
  
}


