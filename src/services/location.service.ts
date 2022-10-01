import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddLocation } from 'src/models/location/add-location.dto';
import { EditLocation } from 'src/models/location/edit-location.dto';
import { GetDetailedLocation } from 'src/models/location/get-detailed-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.tokenService.getToken()}`,
    }),
  };

  url = environment.baseUrl + 'Location/';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getLocations(): Observable<GetSimpleLocation[]> {
    return this.http.get<GetSimpleLocation[]>(this.url + 'GetLocations', {
      headers: this.httpOptions.headers,
    });
  }

  getLocationById(locationId: number): Observable<GetDetailedLocation> {
    return this.http.get<GetDetailedLocation>(this.url + 'GetLocationById', {
      params: { locationId: locationId },
      headers: this.httpOptions.headers,
    });
  }

  addLocation(addLocation: IAddLocation): Observable<any> {
    return this.http.post<any>(this.url + 'AddLocation', addLocation, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }

  editLocation(editLocation: EditLocation): Observable<any> {
    return this.http.patch(this.url + 'EditLocation', editLocation, {
      observe: 'response',
      headers: this.httpOptions.headers,
    });
  }
}
