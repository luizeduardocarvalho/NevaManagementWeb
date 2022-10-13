import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CalendarDto } from 'src/models/equipment-usage/calendar.dto';
import { IUsageHistory } from 'src/models/equipment-usage/usage-history';
import { IUseEquipment } from 'src/models/equipment-usage/use-equipment';

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

  useEquipment(useEquipment: IUseEquipment): Observable<IUseEquipment> {
    return this.http.post<IUseEquipment>(
      this.url + 'UseEquipment',
      useEquipment
    );
  }

  getEquipmentUsage(
    equipmentId: number,
    page: number
  ): Observable<IUsageHistory[]> {
    return this.http.get<IUsageHistory[]>(this.url + 'GetEquipmentUsage', {
      params: {
        equipmentId,
        page,
      },
    });
  }
}
