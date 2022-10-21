import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ISimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';

@Component({
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  faSearch = faSearch as IconProp;
  faPen = faPen as IconProp;

  locations: ISimpleLocation[] = [];
  searchText: string = '';

  isLoading = false;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.locationService
      .getLocations()
      .subscribe((locations: ISimpleLocation[]) => {
        this.locations = locations;
        this.isLoading = false;
      });
  }
}
