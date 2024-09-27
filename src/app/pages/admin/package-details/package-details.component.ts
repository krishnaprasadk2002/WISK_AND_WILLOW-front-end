import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageService } from '../../../core/services/admin/package.service';
import { ActivatedRoute } from '@angular/router';
import { Ipackages } from '../../../core/models/packages.model';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ModalComponent,InputboxComponent,ButtonComponent,AdminNavComponent],
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
  statusEnum:string[]=['Available','Not Available']
  isLoading = false; 
  
  private toastService: ToastService = inject(ToastService); 

  constructor( private fb: FormBuilder, private packageService: PackageService, private route: ActivatedRoute) { }

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
});

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
      this.isLoading = true; 
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
          this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Features added successfully' });
          console.log('Package features added successfully:', response);
          this.closeModal();
          this.packageFeatureForm.reset({ status: 'Available' });
          this.getPackageById();
          this.isLoading = false; 
        },
        error => {
          console.error('Error adding package features:', error);
          this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Error adding package features' });
          this.isLoading = false; 
        }
      );
    }
  }


  onEditSubmit(): void {
    if (this.packageFeatureEditForm.valid && this.editFeatureId) {
      this.isLoading = true; 
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
          this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Feature updated successfully' });
          this.getPackageById();
          this.isLoading = false; 
        },
        error => {
          console.error('Error updating feature:', error);
          this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Error updating feature' });
          this.isLoading = false; 
        }
      );
    } else {
      this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Form is invalid or feature ID is missing' });
    }
  }
  
  getPackageById() {
    this.packageService.getPackageFeaturesById(this.packageId).subscribe(
      (packageFeatureData) => {
        this.packageDetails = packageFeatureData;
        this.totalAmount = this.calculateTotalPrice();
        this.packageService.updateStartingAmount(this.packageId, this.totalAmount).subscribe(
          (response) => {
            console.log('Starting amount updated successfully:', response);
          },
          (error) => {
            console.error('Error updating starting amount:', error);
          }
        );
      },
      (error) => {
        console.error('Getting package feature has an issue', error);
      }
    );
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


