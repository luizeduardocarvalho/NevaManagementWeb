import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl } from 'settings';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentUsageService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = baseUrl + 'EquipmentUsage/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getEquipmentUsageCalendar(id: number): Observable<any> {
    return this.http.get<any>(this.url + 'GetEquipmentUsageCalendar', {
      params: { id: id },
      headers: this.httpOptions.headers,
    });
  }
}
