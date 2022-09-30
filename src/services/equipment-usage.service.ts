import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CalendarDto } from 'src/models/equipment-usage/calendar.dto';
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

  url = environment.baseUrl + 'EquipmentUsage/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getEquipmentUsageCalendar(id: number): Observable<CalendarDto[]> {
    return this.http.get<CalendarDto[]>(this.url + 'GetEquipmentUsageCalendar', {
      params: { id: id },
      headers: this.httpOptions.headers,
    });
  }
}
