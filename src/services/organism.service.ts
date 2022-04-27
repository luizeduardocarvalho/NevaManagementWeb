import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { AddOrganism } from 'src/models/organism/add-organism.dto';
import { EditOrganism } from 'src/models/organism/edit-organism.dto';
import { GetDetailedOrganism } from 'src/models/organism/get-detailed-organism.dto';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';

@Injectable({
  providedIn: 'root'
})
export class OrganismService {

  url = baseUrl + 'Organism/';

  constructor(private http: HttpClient) { }

  getOrganisms(): Observable<GetSimpleOrganism[]> {
    return this.http.get<GetSimpleOrganism[]>(this.url + 'GetOrganisms');
  }

  getOrganismById(organismId: number): Observable<GetDetailedOrganism> {
    return this.http.get<GetDetailedOrganism>(
      this.url + 'GetOrganismById', 
      {
        params: { 'organismId': organismId }
      }
    );
  }

  addOrganism(addOrganism: AddOrganism): Observable<any> {
    return this.http.post<any>(this.url + 'AddOrganism', addOrganism, { observe: 'response' });
  }

  editOrganism(editOrganism: EditOrganism): Observable<any> {
    return this.http.patch(this.url + 'EditOrganism', editOrganism, { observe: 'response' });
  }
}
