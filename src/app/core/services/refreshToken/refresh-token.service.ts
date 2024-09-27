import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private http: HttpClient = inject(HttpClient);

  private baseUrl = environment.baseUrl;

  refreshToken(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}refresh-token`, {});
  }
}
