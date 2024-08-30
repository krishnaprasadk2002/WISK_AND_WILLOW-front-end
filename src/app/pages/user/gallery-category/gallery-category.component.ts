import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryService } from '../../../core/services/admin/gallery.service';
import { IGallery, IGalleryCategory } from '../../../core/models/gallery.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gallery-category',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './gallery-category.component.html',
  styleUrl: './gallery-category.component.css'
})
export class GalleryCategoryComponent implements OnInit {
  categories: IGalleryCategory[] = [];
  galleryImages:IGallery[] = []


  constructor(private router:Router,private galleryService:GalleryService){}
  ngOnInit(): void {
    this.loadGalleryCategory();
  }

  loadGalleryCategory() {
    this.galleryService.getGalleryCategoryData().subscribe(
      categoryData => {
        this.categories = categoryData;
      },
      error => {
        console.error('Error fetching gallery categories', error);
      }
    );
  }

  onCategoryClick(categoryName: string) {
    this.router.navigate(['/user-gallery', categoryName]);
  }

}