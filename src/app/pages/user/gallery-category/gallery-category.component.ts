import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryService } from '../../../core/services/admin/gallery.service';
import { IGallery } from '../../../core/models/gallery.entity';

@Component({
  selector: 'app-gallery-category',
  standalone: true,
  imports: [],
  templateUrl: './gallery-category.component.html',
  styleUrl: './gallery-category.component.css'
})
export class GalleryCategoryComponent implements OnInit {
  categories: string[] = [];
  categoryImages: { [key: string]: IGallery[] } = {};
  galleryImagesData:IGallery[] = []


  constructor(private router:Router,private galleryService:GalleryService){}
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.galleryService.getGalleryData().subscribe(
      (categories) => {
        this.categories = categories;
        // this.loadImagesForCategories(categories);
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  // loadImagesForCategories(categories: string[]): void {
  //   categories.forEach(category => {
  //     this.galleryService.getImagesByCategory(category).subscribe(
  //       (images) => {
           
  //         console.log("dat",images);
  //         this.categoryImages[category] = images;
       
          
          
  //       },
  //       (error) => {
  //         console.error(`Error loading images for category ${category}:`, error);
  //       }
  //     );
  //   });
  // }

}