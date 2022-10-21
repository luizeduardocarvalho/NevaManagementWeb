import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IAddEquipment } from 'src/models/equipment/add-equipment';
import { IEditEquipment } from 'src/models/equipment/edit-equipment';
import { IGetDetailedEquipment } from 'src/models/equipment/get-detailed-equipment.dto';
import { GetSimpleEquipmentDto } from 'src/models/equipment/get-simple-equipment.dto';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  url = environment.baseUrl + 'Equipment/';

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<GetSimpleEquipmentDto[]> {
    return this.http.get<GetSimpleEquipmentDto[]>(this.url + 'GetEquipments');
  }

  getDetailedEquipment(id: number): Observable<IGetDetailedEquipment> {
    return this.http.get<IGetDetailedEquipment>(
      this.url + 'GetDetailedEquipment',
      { params: { id } }
    );
  }

  addEquipment(equipment: IAddEquipment): Observable<any> {
    return this.http.post<any>(this.url + 'AddEquipment', equipment, {
      observe: 'response',
    });
  }

  editEquipment(equipment: IEditEquipment): Observable<any> {
    return this.http.patch(this.url + 'EditEquipment', equipment, {
      observe: 'response',
    });
  }
}
