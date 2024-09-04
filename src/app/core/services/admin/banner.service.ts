import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IBanner } from '../../models/banner.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }

  addBanner(banner: IBanner): Observable<IBanner> {
    return this.http.post<IBanner>(`${this.baseUrl}banner/addbanner`,banner);
  }

  getBanners(page: number, itemsPerPage: number): Observable<{ banners: IBanner[], totalItems: number }> {
    return this.http.get<{ banners: IBanner[], totalItems: number }>(`${this.baseUrl}banner/getbanner`, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }
    });
  }

  updateStatus(banner:IBanner,bannerId:string):Observable<IBanner>{
    return this.http.post<IBanner>(`${this.baseUrl}banner/updatebannerstatus`,{banner,bannerId})
  }

  searchBanners(searchTerm:string):Observable<IBanner[]>{
    return this.http.get<IBanner[]>(`${this.baseUrl}banner/search`,{
      params:{searchTerm}
    })
  }
  
}
