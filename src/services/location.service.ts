import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'settings';
import { AddLocation } from 'src/models/location/add-location.dto';
import { EditLocation } from 'src/models/location/edit-location.dto';
import { GetDetailedLocation } from 'src/models/location/get-detailed-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  url = baseUrl + 'Location/';

  constructor(private http: HttpClient) { }

  getLocations(): Observable<GetSimpleLocation[]> {
    return this.http.get<GetSimpleLocation[]>(this.url + 'GetLocations');
  }

  getLocationById(locationId: number): Observable<GetDetailedLocation> {
    return this.http.get<GetDetailedLocation>(
      this.url + 'GetLocationById', 
      {
        params: { 'locationId': locationId }
      }
    );
  }

  addLocation(addLocation: AddLocation): Observable<any> {
    return this.http.post<any>(this.url + 'AddLocation', addLocation, { observe: 'response' });
  }

  editLocation(editLocation: EditLocation): Observable<any> {
    return this.http.patch(this.url + 'EditLocation', editLocation, { observe: 'response' });
  }
}
