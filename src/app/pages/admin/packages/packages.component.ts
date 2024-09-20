import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/users/event.service';
import { PackageService } from '../../../core/services/admin/package.service';
import { Ipackages } from '../../../core/models/packages.model';
import { Router } from '@angular/router';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { noWhitespaceValidator } from '../../../shared/validators/form.validator';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputboxComponent, ButtonComponent, ModalComponent, AdminNavComponent, ReusableTableComponent],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent implements OnInit {
  packageForm!: FormGroup
  editpackageForm!: FormGroup
  isModalOpen: Boolean = false
  eventNames: string[] = []
  packages: Ipackages[] = []
  selectedImage: string | ArrayBuffer | null = null;
  isEditModalOpen: boolean = false
  packageId!: string

  private toastService: ToastService = inject(ToastService);

  headArray: any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Type Of Event", fieldName: "type_of_event", datatype: "string" },
    { header: "StartingAmount", fieldName: "startingAt", datatype: "string" },
    { header: "image", fieldName: "image", datatype: "string" },
  ]

  filteredPackage: Ipackages[] = []
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;

  constructor(private eventService: EventService, private fb: FormBuilder, private packageService: PackageService, private router: Router) { }


  ngOnInit(): void {
    this.packageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]],
      type_of_event: ['', [Validators.required]],
      startingAmount: ['', [Validators.required]],
      image: [null]
    })
    this.editpackageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]],
      type_of_event: ['', [Validators.required, Validators.maxLength(100)]],
      startingAmount: ['', [Validators.required]],
      image: [null]
    })

    this.getEventName()
    this.getPackages(this.currentPage);
  }

  openModal(target: string) {
    if (target == 'add') {
      this.isModalOpen = true
    }
  }

  getEventName() {
    this.eventService.getEvent().subscribe(
      (events) => {
        this.eventNames = events.map(event => event.name);
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditModalOpen = false;
    this.selectedImage = null;
    this.packageForm.reset();
    this.editpackageForm.reset();
  }


  getPackages(page: number = this.currentPage): void {
    this.packageService.getPackages(page, this.itemsPerPage).subscribe(
      (packagesData) => {
        this.packages = packagesData.packages;
        this.filteredPackage = [...this.packages];
        this.totalItems = packagesData.totalItems;
      },
      (error) => {
        console.error('Error fetching packages', error);
      }
    );
  }


  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(file);
    }
  }






  onSubmit() {
    if (this.packageForm.valid) {
      let packageData = this.packageForm.value;
      packageData = { ...packageData, image: this.selectedImage };

      this.packageService.addPackages(packageData).subscribe(
        response => {
          console.log('Package added successfully', response);
          this.packages.push(response);
          this.filteredPackage = [...this.packages];
          this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Package added successfully!' });
          this.closeModal();
        },
        error => {
          console.error('Package adding failed', error);
          this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Failed to add package. Please try again.' })
        }
      );
    } else {
      this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Please fill out the form correctly.' })
    }
  }



  openPackageDetails(item: any) {
    const packageId = item._id;
    this.router.navigate(['/admin/package-details', packageId]);
  }


  editPackages({ item, id }: { item: Ipackages; id: string }) {
    this.packageId = id;
    this.isEditModalOpen = true;

    this.editpackageForm.patchValue({
      name: item.name,
      type_of_event: item.type_of_event,
      startingAmount: item.startingAt,
    });

    this.selectedImage = item.image ? item.image : null;
  }





  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase();
    if (searchTerm) {
      this.packageService.searchPackages(searchTerm).subscribe(
        items => {
          this.filteredPackage = items;
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.getPackages(this.currentPage);
    }
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.getPackages(this.currentPage);
  }

  onEditSubmit() {
    if (this.editpackageForm.valid) {
      let packageData = this.editpackageForm.value;

      if (this.selectedImage) {
        packageData = { ...packageData, image: this.selectedImage };
      }

      this.packageService.editPackage(packageData, this.packageId).subscribe(
        response => {
          console.log('Package updated successfully', response);
          const index = this.packages.findIndex(pkg => pkg._id === this.packageId);
          if (index !== -1) {
            this.packages[index] = { ...this.packages[index], ...response };
            this.filteredPackage = [...this.packages];
          }
          this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Package updated successfully!' });
          this.closeModal();
        },
        error => {
          console.error('Package updating failed', error);
          this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Failed to update package. Please try again.' })
        }
      );
    } else {
      this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Please fill out the form correctly.' })
    }
  }

  deletePackage(item: string) {
    this.packageService.deletePackage(item).subscribe(
      () => {
        this.toastService.showToast({ severity: 'success', summary: 'Success', detail: 'Package deleted successfully' });
        console.log("Package deleted successfully");
        this.getPackages()
      },
      (error) => {
        this.toastService.showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting package' })
        console.error('Error deleting package:', error);
      })
  }
}
