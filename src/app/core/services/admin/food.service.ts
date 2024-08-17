import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFood } from '../../models/food.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  baseUrl  = environment.baseUrl
  constructor(private http:HttpClient) { }

  addFoods(foodData:IFood):Observable<IFood>{
    return this.http.post<IFood>(`${this.baseUrl}food/addFood`,foodData)
  }

  getFood(page: number, itemsPerPage: number): Observable<{ foods: IFood[], totalItems: number }> {
    return this.http.get<{ foods: IFood[], totalItems: number }>(`${this.baseUrl}food/getfoods`, {
      params: { 
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }
    })
  }

editFoods(editFoodData: IFood,foodId:string): Observable<IFood> {
  return this.http.put<IFood>(`${this.baseUrl}food/editfooddata`, {editFoodData,foodId});
}
searchUsers(searchTerm: string): Observable<IFood[]> {
  return this.http.get<IFood[]>(`${this.baseUrl}food/search`, {
    params: { searchTerm }
  });
}


}
