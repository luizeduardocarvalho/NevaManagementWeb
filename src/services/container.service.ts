import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddContainer } from 'src/models/container/add-container';
import { GetContainersOrderedByTransferDateDto } from 'src/models/container/get-containers-ordered-by-transfer-date.dto';
import { GetDetailedContainer } from 'src/models/container/get-detailed-container.dto';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  url = environment.baseUrl + 'Container/';

  constructor(private http: HttpClient) {}

  getContainers(): Observable<GetSimpleContainer[]> {
    return this.http.get<GetSimpleContainer[]>(this.url + 'GetContainers');
  }

  addContainer(addContainer: IAddContainer): Observable<any> {
    return this.http.post<any>(this.url + 'AddContainer', addContainer, {
      observe: 'response',
    });
  }

  getChildrenContainers(containerId: number): Observable<GetSimpleContainer[]> {
    return this.http.get<GetSimpleContainer[]>(
      this.url + 'GetChildrenContainers',
      { params: { containerId } }
    );
  }

  getDetailedContainer(containerId: number): Observable<GetDetailedContainer> {
    return this.http.get<GetDetailedContainer>(
      this.url + 'GetDetailedContainer',
      { params: { containerId } }
    );
  }

  getContainersOrderedByTransferDate(): Observable<
    GetContainersOrderedByTransferDateDto[]
  > {
    return this.http.get<GetContainersOrderedByTransferDateDto[]>(
      this.url + 'GetContainersOrderedByTransferDate'
    );
  }
}
