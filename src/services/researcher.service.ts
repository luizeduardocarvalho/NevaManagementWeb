import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetSimpleResearcher } from 'src/models/researcher/get-simple-researcher.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ResearcherService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = environment.baseUrl + 'Researcher/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getResearchers(): Observable<GetSimpleResearcher[]> {
    return this.http.get<GetSimpleResearcher[]>(this.url + 'GetResearchers', {
      headers: this.httpOptions.headers,
    });
  }
}
