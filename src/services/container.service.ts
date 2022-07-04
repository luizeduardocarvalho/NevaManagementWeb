import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { AddContainer } from 'src/models/container/add-container.dto';
import { GetContainersOrderedByTransferDateDto } from 'src/models/container/get-containers-ordered-by-transfer-date.dto';
import { GetDetailedContainer } from 'src/models/container/get-detailed-container.dto';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = baseUrl + 'Container/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getContainers(): Observable<GetSimpleContainer[]> {
    return this.http.get<GetSimpleContainer[]>(this.url + 'GetContainers', {
      headers: this.httpOptions.headers,
    });
  }

  addContainer(addContainer: AddContainer): Observable<any> {
    return this.http.post<any>(this.url + 'AddContainer', addContainer, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  getChildrenContainers(id: number): Observable<GetSimpleContainer[]> {
    return this.http.get<GetSimpleContainer[]>(
      this.url + 'GetChildrenContainers',
      {
        params: { containerId: id },
        headers: this.httpOptions.headers,
      }
    );
  }

  getDetailedContainer(id: number): Observable<GetDetailedContainer> {
    return this.http.get<GetDetailedContainer>(
      this.url + 'GetDetailedContainer',
      {
        params: { containerId: id },
        headers: this.httpOptions.headers,
      }
    );
  }

  getContainersOrderedByTransferDate(): Observable<GetContainersOrderedByTransferDateDto[]> {
    return this.http.get<GetContainersOrderedByTransferDateDto[]>(
      this.url + 'GetContainersOrderedByTransferDate',
      {
        headers: this.httpOptions.headers,
      }
    );
  }
}
