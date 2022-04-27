import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddLocation } from 'src/models/location/add-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  createForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  selectedLocation: number = 0;
  locations: GetSimpleLocation[] = [];

  isLoading = false;

  constructor(
    private locationService: LocationService,
    private router: Router,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        this.locations = locations;
        this.isLoading = false;
      }
    );
  }

  selectLocation(e: any) {
    this.selectedLocation = e.target.value;
  }

  onSubmit() {
    let location = this.createForm.value as AddLocation;
    location.sublocationid = null;

    if (this.selectedLocation != 0) {
      location.sublocationid = this.selectedLocation;
    }

    this.isLoading = true;

    this.locationService.addLocation(location).subscribe(
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
        }
      },
      () => this.isLoading = false
    );
  }
}
