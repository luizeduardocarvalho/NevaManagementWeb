import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddLocation } from 'src/models/location/add-location.dto';
import { IEditLocation } from 'src/models/location/edit-location.dto';
import { GetDetailedLocation } from 'src/models/location/get-detailed-location.dto';
import { ISimpleLocation } from 'src/models/location/get-simple-location.dto';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  url = environment.baseUrl + 'Location/';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<ISimpleLocation[]> {
    return this.http.get<ISimpleLocation[]>(this.url + 'GetLocations');
  }

  getLocationById(locationId: number): Observable<GetDetailedLocation> {
    return this.http.get<GetDetailedLocation>(this.url + 'GetLocationById', {
      params: { locationId },
    });
  }

  addLocation(addLocation: IAddLocation): Observable<any> {
    return this.http.post<any>(this.url + 'AddLocation', addLocation, {
      observe: 'response',
    });
  }

  editLocation(editLocation: IEditLocation): Observable<any> {
    return this.http.patch(this.url + 'EditLocation', editLocation, {
      observe: 'response',
    });
  }
}
