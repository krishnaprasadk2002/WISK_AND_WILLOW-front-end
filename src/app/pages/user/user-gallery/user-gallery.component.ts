import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGallery } from '../../../core/models/gallery.entity';
import { GalleryService } from '../../../core/services/admin/gallery.service';

@Component({
  selector: 'app-user-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-gallery.component.html',
  styleUrl: './user-gallery.component.css'
})
export class UserGalleryComponent implements OnInit {
  category:string | null ='';
  galleryImages:IGallery[] = []

  constructor(private route:ActivatedRoute,private galleryService:GalleryService){}
  
ngOnInit(): void {
  this.category = this.route.snapshot.paramMap.get('category');
  this.loadGallery()
}

loadGallery() {
  if (this.category) { 
    this.galleryService.getImagesByCategoryName(this.category).subscribe(
      getData => {
        this.galleryImages = getData;
        console.log(getData);
        
      },
      error => {
        console.error('Error fetching gallery images:', error);
      }
    );
  } else {
    console.warn('Category is null, cannot fetch gallery images.');
  }
}

}
