import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { GetSimpleResearcher } from 'src/models/researcher/get-simple-researcher.dto';

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  url = baseUrl + 'Researcher/';

  constructor(private http: HttpClient) { }

  getResearchers(): Observable<GetSimpleResearcher[]> {
    return this.http.get<GetSimpleResearcher[]>(this.url + 'GetResearchers');
  }
}
