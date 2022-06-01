import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { CreateProductDto } from 'src/models/product/create-product-dto';
import { LocationService } from 'src/services/location.service';
import { ProductService } from 'src/services/product.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  createForm = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null),
    quantity: new FormControl(0),
    unit: new FormControl(null),
    locationId: new FormControl(null),
    formula: new FormControl(null),
    expirationDate: new FormControl()
  });

  selectedLocation: number = 0;
  locations: GetSimpleLocation[] = [];

  isLoading = false;

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => this.locations = locations);
  }

  selectLocation(e: any) {
    this.selectedLocation = e.target.value;
  }

  onSubmit() {
    this.isLoading = true;
    let product = this.createForm.value as CreateProductDto;

    product.locationId = null;

    if (this.selectedLocation != 0) {
      product.locationId = this.selectedLocation;
    }

    this.productService.create(product).subscribe(
      (res: any) => {
        this.router.navigate(['/products']).then(() => {
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
