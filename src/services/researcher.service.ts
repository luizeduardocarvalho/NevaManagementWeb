import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGetSimpleResearcher } from 'src/models/researcher/get-simple-researcher';

@Injectable({
  providedIn: 'root',
})
export class ResearcherService {
  url = environment.baseUrl + 'Researcher/';

  constructor(private http: HttpClient) {}

  getResearchers(): Observable<IGetSimpleResearcher[]> {
    return this.http.get<IGetSimpleResearcher[]>(this.url + 'GetResearchers');
  }
}
