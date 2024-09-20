import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ipackages } from '../../models/packages.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IFood } from '../../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  addPackages(packagesData: Ipackages): Observable<Ipackages> {
    return this.http.post<Ipackages>(`${this.baseUrl}package/addpackage`, packagesData);
  }

  getPackages(page: number, itemsPerPage: number): Observable<{ packages: Ipackages[], totalItems: number }> {
    return this.http.get<{ packages: Ipackages[], totalItems: number }>(`${this.baseUrl}package/getpackages`,
      {
        params: {
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString()
        }
      })
  }

  loadPackage():Observable<Ipackages[]>{
    return this.http.get<Ipackages[]>(`${this.baseUrl}package/loadpackage`)
  }




  addPackageFeatures(packageId: string, packageItems: { itemName: string; price: number; status: boolean }[]): Observable<Ipackages> {
    return this.http.post<Ipackages>(`${this.baseUrl}package/addpackagefeatures/${packageId}`, { packageItems });
  }

  getPackageFeaturesById(packageId: string): Observable<Ipackages> {
    return this.http.get<Ipackages>(`${this.baseUrl}package/getpackagebyid/${packageId}`)
  }

  editPackageFeature(packageId: string, featureData: Ipackages): Observable<Ipackages> {
    return this.http.put<Ipackages>(`${this.baseUrl}package/editpackagefeature`, { packageId, featureData })

  }

  searchPackages(searchTerm: string): Observable<Ipackages[]> {
    return this.http.get<Ipackages[]>(`${this.baseUrl}package/search`, {
      params: { searchTerm }
    })
  }

  editPackage(packageData: Ipackages, packageId: string): Observable<Ipackages> {
    return this.http.put<Ipackages>(`${this.baseUrl}package/editpackages`, { packageData,packageId })
  }

  deletePackage(packageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}package/deletepackage`,
      {params:{packageId}}
    );
  }
  
  getPackageDetailsByName(name: string): Observable<Ipackages> {
    return this.http.get<Ipackages>(`${this.baseUrl}package/getpackagedatabyname`,
      {params:{name}}
    );
  }

  getPackageFood():Observable<IFood[]>{
    return this.http.get<IFood[]>(`${this.baseUrl}package/getfoods`)
  }

  updateStartingAmount(packageId: string, startingAmount: number): Observable<Ipackages> {
    return this.http.put<Ipackages>(`${this.baseUrl}package/updatestartingamount`, { packageId, startingAmount });
  }

  submitPackageRating(packageId: string, rating: number): Observable<any> {
    const params = new HttpParams().set('rating', rating.toString());
    return this.http.post<any>(`${this.baseUrl}package/${packageId}/rate`, null, { params });
  }
  
}
