import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { AddContainer } from 'src/models/container/add-container.dto';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  url = baseUrl + 'Container/';

  constructor(private http: HttpClient) { }

  getContainers(): Observable<GetSimpleContainer[]> {
    return this.http.get<GetSimpleContainer[]>(this.url + 'GetContainers');
  }

  addContainer(addContainer: AddContainer): Observable<any> {
    return this.http.post<any>(this.url + 'AddContainer', addContainer, { observe: 'response' });
  }
}
