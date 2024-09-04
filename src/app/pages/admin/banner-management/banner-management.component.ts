import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';
import { IBanner } from '../../../core/models/banner.model';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { BannerService } from '../../../core/services/admin/banner.service';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banner-management',
  standalone: true,
  imports: [AdminNavComponent, ReusableTableComponent, ModalComponent, CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputboxComponent],
  templateUrl: './banner-management.component.html',
  styleUrl: './banner-management.component.css'
})
export class BannerManagementComponent implements OnInit {
  bannerData: IBanner[] = []
  filteredBanners: IBanner[] = []
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  searchTerm: string = '';
  isModalOpen: Boolean = false;
  bannerForm!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private bannerService: BannerService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.initializeForm();
    this.loadBanners(this.currentPage)
  }

  initializeForm() {
    this.bannerForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
    });
  }

  headArray: any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Description", fieldName: "description", datatype: "string" },
    { header: "Banner", fieldName: "image", datatype: "string" },
    { header: "Status", fieldName: "status", datatype: "string" },
  ];

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase().trim();

    if (searchTerm) {
      this.bannerService.searchBanners(searchTerm).subscribe(
        data => {
          this.filteredBanners = data;
        },
        error => {
          console.error('Error fetching search results:', error);
          this.filteredBanners = [];
        }
      );
    } else {
      this.loadBanners(this.currentPage);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          this.selectedImage = result;
          this.bannerForm.patchValue({
            image: this.selectedImage
          });
        } else {
          console.error('Failed to read file as a Base64 string');
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  }




  openModal(target: string) {
    if (target === 'add') {
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  loadBanners(page: number = this.currentPage) {
    this.bannerService.getBanners(page, this.itemsPerPage).subscribe(
      (data) => {
        this.bannerData = data.banners;
        this.filteredBanners = this.bannerData;
        this.totalItems = data.totalItems;
      },
      (error) => {
        console.error('Error loading banners', error);
      }
    );
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      let newBanner: IBanner = this.bannerForm.value;
      if (typeof this.selectedImage === 'string') {
        newBanner = { ...newBanner, image: this.selectedImage };
      } else {
        console.error('Image data is not a valid string');
        return;
      }
      this.bannerService.addBanner(newBanner).subscribe(
        (banner) => {
          if(this.bannerData.length > 4){
            this.bannerData.push(banner);
            this.loadBanners(this.currentPage)
          }else{
            this.bannerData.push(banner);
          }
          this.toastr.success('Banner added successfully');
          this.closeModal();
          this.filteredBanners = this.bannerData;
          this.totalItems = this.bannerData.length;
        },
        (error) => {
          console.error('Error adding banner', error);
          this.toastr.error('Failed to add banner');
        }
      );
    }
  }

  toggleStatus(banner: IBanner) {
    banner = { ...banner, status: !banner.status };

    const bannerId = banner._id;

    this.bannerService.updateStatus(banner, bannerId).subscribe(
      () => {
        this.toastr.success('Banner status updated successfully');
        this.loadBanners(this.currentPage);
      },
      error => {
        console.error('Error updating banner status:', error);
        this.toastr.error('Failed to update banner status');
        banner.status = !banner.status;
      }
    );
  }

}