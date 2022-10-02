import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IAddEquipment } from 'src/models/equipment/add-equipment';
import { IEditEquipment } from 'src/models/equipment/edit-equipment';
import { GetDetailedEquipmentDto } from 'src/models/equipment/get-detailed-equipment.dto';
import { GetSimpleEquipmentDto } from 'src/models/equipment/get-simple-equipment.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = environment.baseUrl + 'Equipment/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getEquipments(): Observable<GetSimpleEquipmentDto[]> {
    return this.http.get<GetSimpleEquipmentDto[]>(this.url + 'GetEquipments', {
      headers: this.httpOptions.headers,
    });
  }

  getDetailedEquipment(id: number): Observable<GetDetailedEquipmentDto> {
    return this.http.get<GetDetailedEquipmentDto>(
      this.url + 'GetDetailedEquipment',
      { headers: this.httpOptions.headers, params: { id: id } }
    );
  }

  addEquipment(equipment: IAddEquipment): Observable<any> {
    return this.http.post<any>(this.url + 'AddEquipment', equipment, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  editEquipment(equipment: IEditEquipment): Observable<any> {
    return this.http.patch(this.url + 'EditEquipment', equipment, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }
}
