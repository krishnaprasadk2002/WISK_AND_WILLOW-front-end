import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IGallery, IGalleryCategory } from '../../models/gallery.entity';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

  addGallery(galleryData: IGallery): Observable<IGallery> {
    return this.http.post<IGallery>(`${this.baseUrl}gallery/addImages`, galleryData);
  }
  

  addGalleryCategory(galleryCategoryData:IGalleryCategory):Observable<IGalleryCategory>{
    return this.http.post<IGalleryCategory>(`${this.baseUrl}gallery/galleryCategory`,galleryCategoryData)
  }

  getGalleryCategory():Observable<IGalleryCategory[]>{
    return this.http.get<IGalleryCategory[]>(`${this.baseUrl}gallery/getgallerycategory`)
  }

  getGalleryImage():Observable<IGallery[]>{
    return this.http.get<IGallery[]>(`${this.baseUrl}gallery/getgalleryImage`)
  }
}
