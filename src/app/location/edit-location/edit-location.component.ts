import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditLocation } from 'src/models/location/edit-location.dto';
import { GetDetailedLocation } from 'src/models/location/get-detailed-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {
  
  editLocationForm = new FormGroup({
    name: new FormControl(null),
    subLocation: new FormControl(),
    description: new FormControl(null)
  });

  locationId: number = 0;
  locations: GetSimpleLocation[] = [];
  location?: GetDetailedLocation;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.locationId = params['id'];
    });

    this.isLoading = true;

    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        this.locations = locations;
        this.locations.unshift(new GetSimpleLocation(null, 'No SubLocation'));

        this.locationService
          .getLocationById(this.locationId)
          .subscribe((location: GetDetailedLocation) => {
            this.location = location;

            let selectedLocation = this.locations[0];

            if (this.location.subLocationId != null) {
              selectedLocation = this.locations[this.location.subLocationId];
            }

            this.fillForm(this.location, selectedLocation);
            this.isLoading = false;
          });
      });
  }

  fillForm(location: GetDetailedLocation, selectedLocation: GetSimpleLocation) {
    this.editLocationForm = new FormGroup({
      name: new FormControl(location.name),
      subLocation: new FormControl(selectedLocation),
      description: new FormControl(location.description)
    });
  }

  onSubmit() {
    let editLocation = this.editLocationForm.value as EditLocation;
    editLocation.id = this.locationId;
    editLocation.subLocationId = this.editLocationForm.value.subLocation.id;

    this.isLoading = true;

    this.locationService.editLocation(editLocation).subscribe(
      (res: any) => {
        this.router.navigate(['/locations']).then(() => {
          this.toastService.show(res.body, 'Success', false);
        });
      },
      (err: any) => {
        let message = '';
        let errors = err.error.errors;

        if (errors != null) {
          let keys = Object.keys(errors);
          keys.forEach((key: any) => {
            errors[key].forEach((errorMessage: string) => {
              message = errorMessage;
            })
          });

          this.toastService.show(message, 'Error', true);
          this.isLoading = false;
        }
      },
      () => this.isLoading = false
    );
  }
}
