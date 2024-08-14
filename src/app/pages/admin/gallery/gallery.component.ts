import { Component, OnInit } from '@angular/core';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GalleryService } from '../../../core/services/admin/gallery.service';
import { ToastrService } from 'ngx-toastr';
import { IGallery, IGalleryCategory } from '../../../core/models/gallery.entity';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  galleryItems:IGallery[] = []
  isGalleryImageModalOpen:boolean = false;
  isCategoryModalOpen:boolean = false
  categories: string[] = []; 
  galleryImageForm!:FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  categoryForm!:FormGroup

  form!:FormGroup



  constructor(private navService:AdminNavService,private fb: FormBuilder,private galleryService:GalleryService, private toastr: ToastrService){
    this.galleryImageForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadGalleryCategory()
    this.loadGalleryImage()
  }


  editGalleryItem(Images:IGallery){

  }

  deleteGalleryItem(imageId:string){

  }

  openGalleryImageModal(): void {
    this.isGalleryImageModalOpen = true;
  }

  closeGalleryImageModal(): void {
    this.isGalleryImageModalOpen = false;
  }

  openCategoryModal(): void {
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
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

  toggleSidebar(){
 this.navService.toggleSidebar()
  }

  loadGalleryCategory(){
    this.galleryService.getGalleryCategory().subscribe(
      category => {
        this.categories = category.map(cat => cat.name);
        
      },
      error => {
        console.error('Failed to load categories:', error);
      }
    )
   
  }

  loadGalleryImage(){
    this.galleryService.getGalleryImage().subscribe(
      galleryData => {
        this.galleryItems = galleryData
      },
      error => {
        console.error('Failed to load categories:', error);
      }
    )
  }


  onSubmitGalleryImage(): void {
    if (this.galleryImageForm.valid) {
      const galleryData = this.galleryImageForm.value;
      console.log('Submitting gallery data', galleryData); 
      this.galleryService.addGallery(galleryData).subscribe(
        response => {
          this.toastr.success('Gallery image added successfully!', 'Success');
          this.galleryImageForm.reset();
          this.imagePreview = null;
          this.closeGalleryImageModal();
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



  onSubmitCategory():void{
    if(this.categoryForm.value){
      const galleryCategory = this.categoryForm.value
      this.galleryService.addGalleryCategory(galleryCategory).subscribe(
        response =>{
          this.toastr.success('Gallery category added successfully!', 'Success');
          this.categoryForm.reset()
          this.closeCategoryModal()
        },
        error => {
          this.toastr.error('Failed to add gallery image.', 'Error');
        }
      )
    }
  }
}
