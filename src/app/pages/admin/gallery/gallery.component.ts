import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryService } from '../../../core/services/admin/gallery.service';
import { ToastrService } from 'ngx-toastr';
import { IGallery, IGalleryCategory } from '../../../core/models/gallery.entity';
import { InputboxComponent } from '../../../shared/reusable/inputbox/inputbox.component';
import { ButtonComponent } from '../../../shared/reusable/button/button.component';
import { ModalComponent } from '../../../shared/reusable/modal/modal.component';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { ReusableTableComponent } from '../../../shared/reusable/reusable-table/reusable-table.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputboxComponent, ButtonComponent, ModalComponent,AdminNavComponent,ReusableTableComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  galleryItems: IGallery[] = []
  isGalleryImageModalOpen: boolean = false;
  isCategoryModalOpen: boolean = false
  categories: string[] = [];
  galleryImageForm!: FormGroup;
  editGalleryImageForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: any = null;
  categoryForm!: FormGroup
  form!: FormGroup
  headArray:any[] = [
    { header: "Name", fieldName: "name", datatype: "string" },
    { header: "Image", fieldName: "image", datatype: "string" },
    { header: "Category", fieldName: "image_category", datatype: "string" },
  ]
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  filteredGallery:IGallery[] = []
  isEditModalOpen:boolean = false

  constructor(private navService: AdminNavService, private fb: FormBuilder, private galleryService: GalleryService, private toastr: ToastrService) {
    this.galleryImageForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });
    this.editGalleryImageForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryImage:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGalleryCategory()
    this.loadGalleryImage()
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editGalleryImageForm.reset();
    this.imagePreview = null;
  }

  deleteGalleryItem(imageId: string) {
    this.galleryService.DeleteGalleryData(imageId).subscribe(
      () => {
        this.toastr.success('Gallery image deleted successfully!', 'Success');
        this.loadGalleryImage();
      },
      (error: any) => {
        console.error('Error deleting gallery image:', error);
        this.toastr.error('Failed to delete gallery image.', 'Error');
      }
    );
  }
  

  openGalleryImageModal(): void {
    this.isGalleryImageModalOpen = true;
    this.imagePreview = null; 
    this.categoryForm.reset()
  }

  closeGalleryImageModal(): void {
    this.isGalleryImageModalOpen = false;
    this.galleryImageForm.reset();
    this.imagePreview = null;
  }
  openCategoryModal(): void {
    this.isCategoryModalOpen = true;
    this.imagePreview = null
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
    this.categoryForm.reset()
    this.imagePreview = null
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.galleryImageForm.patchValue({
          image: reader.result as string
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCategoryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = reader.result as string;
  
        console.log('Base64 String:', base64String);
        this.imagePreview = base64String;
        this.categoryForm.patchValue({
          categoryImage: base64String
        });
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  
  originalGalleryItem: IGallery | null = null;

  editGalleryItem(image: IGallery, imageId: string) {
    this.isEditModalOpen = true;
    this.selectedImage = image;
    this.originalGalleryItem = { ...image }; 
  
    this.editGalleryImageForm.patchValue({
      name: image.name,
      category: image.image_category,
    });
    this.imagePreview = image.image ? image.image.toString() : null;
  }
  
  
  
  loadGalleryCategory() {
    this.galleryService.getGalleryCategory().subscribe(
      category => {
        this.categories = category.map(cat => cat.name);

      },
      error => {
        console.error('Failed to load categories:', error);
      }
    )
  }

  loadGalleryImage() {
    this.galleryService.getGalleryImage(this.currentPage, this.itemsPerPage).subscribe(
      galleryData => {
        this.galleryItems = galleryData.gallery;
        this.filteredGallery = this.galleryItems;
        this.totalItems = galleryData.totalItems;
      },
      error => {
        console.error('Failed to load gallery images:', error);
      }
    );
  }


  onSubmitGalleryImage(): void {
    if (this.galleryImageForm.valid) {
      const galleryData = this.galleryImageForm.value;
      console.log('Submitting gallery data', galleryData);
      this.galleryService.addGallery(galleryData).subscribe(
        response => {
          this.toastr.success('Gallery image added successfully!', 'Success');
          this.imagePreview = null;
          this.closeGalleryImageModal();
          this.loadGalleryImage()
        },
        error => {
          console.error('Error adding gallery image', error);
          this.toastr.error('Failed to add gallery image.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }

  onSubmitCategory(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.galleryService.addGalleryCategory(categoryData).subscribe(
        response => {
          this.toastr.success('Category added successfully!', 'Success');
          this.closeCategoryModal();
          this.loadGalleryCategory();
        },
        error => {
          console.error('Error adding category:', error);
          this.toastr.error('Failed to add category.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please fill in all the required fields.', 'Error');
    }
  }
  

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadGalleryImage(); 
  }
  

  onSearchTermChanged(value: string) {
    const searchTerm = value.toLowerCase();
    if (searchTerm) {
      this.galleryService.searchImage(searchTerm).subscribe(
        items => {
          this.filteredGallery = items;
          this.totalItems = items.length;
        },
        error => {
          console.error('Error searching images:', error);
        }
      );
    } else {
      this.loadGalleryImage(); 
    }
  }

  onSubmitEditGalleryImage(): void {
    if (this.editGalleryImageForm.valid && this.selectedImage) {
      const updatedData = this.editGalleryImageForm.value;
      updatedData.image = this.imagePreview;
  
      this.galleryService.updateGallery(this.selectedImage._id, updatedData).subscribe(
        response => {
          this.toastr.success('Gallery image updated successfully!', 'Success');
          this.loadGalleryImage(); 
          this.closeEditModal();
        },
        error => {
          console.error('Error updating gallery image', error);
          this.toastr.error('Failed to update gallery image.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
  
  
  
}
