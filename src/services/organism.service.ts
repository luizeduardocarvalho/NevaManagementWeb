import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { AddOrganism } from 'src/models/organism/add-organism.dto';
import { EditOrganism } from 'src/models/organism/edit-organism.dto';
import { GetDetailedOrganism } from 'src/models/organism/get-detailed-organism.dto';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OrganismService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = baseUrl + 'Organism/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getOrganisms(): Observable<GetSimpleOrganism[]> {
    return this.http.get<GetSimpleOrganism[]>(this.url + 'GetOrganisms', {
      headers: this.httpOptions.headers,
    });
  }

  getOrganismById(organismId: number): Observable<GetDetailedOrganism> {
    return this.http.get<GetDetailedOrganism>(this.url + 'GetOrganismById', {
      params: { organismId: organismId },
      headers: this.httpOptions.headers,
    });
  }

  addOrganism(addOrganism: AddOrganism): Observable<any> {
    return this.http.post<any>(this.url + 'AddOrganism', addOrganism, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  editOrganism(editOrganism: EditOrganism): Observable<any> {
    return this.http.patch(this.url + 'EditOrganism', editOrganism, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }
}
