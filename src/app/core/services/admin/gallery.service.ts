import { HttpClient, HttpParams } from '@angular/common/http';
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
  getGalleryImage(page: number, itemsPerPage: number): Observable<{ gallery: IGallery[], totalItems: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
  
    return this.http.get<{ gallery: IGallery[], totalItems: number }>(`${this.baseUrl}gallery/getgalleryImage`, { params });
  }
  

  searchImage(searchTerm: string): Observable<IGallery[]> {
    return this.http.get<IGallery[]>(`${this.baseUrl}gallery/search`, {
      params: { searchTerm }
    });
  }

  updateGallery(galleryId:string,galleryData:IGallery):Observable<IGallery>{
    return this.http.put<IGallery>(`${this.baseUrl}gallery/editgalleryimage`,{galleryId,galleryData})
  }

  DeleteGalleryData(galleryId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}gallery/deleteGalleryData`, {
      params: { id: galleryId }
    });
  }

  getGalleryData():Observable<string[]>{
    return this.http.get<string[]>(`${this.baseUrl}gallery/getuniquecategory`)
  }
  
  getImagesByCategory(category: string): Observable<IGallery[]> {
    return this.http.get<IGallery[]>(`${this.baseUrl}gallery/images/${category}`);
}
}
