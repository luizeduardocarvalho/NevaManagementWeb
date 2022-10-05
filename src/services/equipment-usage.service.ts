import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CalendarDto } from 'src/models/equipment-usage/calendar.dto';

@Injectable({
  providedIn: 'root',
})
export class EquipmentUsageService {
  url = environment.baseUrl + 'EquipmentUsage/';

  constructor(private http: HttpClient) {}

  getEquipmentUsageCalendar(id: number): Observable<CalendarDto[]> {
    return this.http.get<CalendarDto[]>(
      this.url + 'GetEquipmentUsageCalendar',
      { params: { id } }
    );
  }
}
