import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ipackages } from '../../models/packages.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  baseUrl = environment.baseUrl

  constructor(private http:HttpClient) { }

 addPackages(packagesData: Ipackages): Observable<Ipackages> {
  return this.http.post<Ipackages>(`${this.baseUrl}package/addpackage`, packagesData);
}

getPackages():Observable<Ipackages[]>{
  return this.http.get<Ipackages[]>(`${this.baseUrl}package/getpackages`)
}

addPackageFeatures(packageId: string, packageItems: { itemName: string; price: number; status: boolean }[]): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}package/addpackagefeatures/${packageId}`, { packageItems });
}

getPackageFeaturesById(packageId:string):Observable<Ipackages>{
  return this.http.get<Ipackages>(`${this.baseUrl}package/getpackagebyid/${packageId}`)
}

editPackageFeature(packageId:string,featureData:Ipackages):Observable<Ipackages>{
  return this.http.put<Ipackages>(`${this.baseUrl}package/editpackagefeature`,{packageId,featureData})

}

}
