import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-gallery',
  standalone: true,
  imports: [],
  templateUrl: './user-gallery.component.html',
  styleUrl: './user-gallery.component.css'
})
export class UserGalleryComponent implements OnInit {
  category:string | null ='';

  constructor(private route:ActivatedRoute){}
  
ngOnInit(): void {
  this.category = this.route.snapshot.paramMap.get('category');
}

loadGallery(){
  
}

}
