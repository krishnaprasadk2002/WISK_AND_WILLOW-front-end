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

  getFood(): Observable<IFood[]> {
    return this.http.get<IFood[]>(`${this.baseUrl}food/getfoods`);
}

editFoods(editFoodData: IFood,foodId:string): Observable<IFood> {
  return this.http.put<IFood>(`${this.baseUrl}food/editfooddata`, {editFoodData,foodId});
}

}
