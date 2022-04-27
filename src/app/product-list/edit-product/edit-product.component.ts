import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { CreateProductDto } from 'src/models/product/create-product-dto';
import { EditProduct } from 'src/models/product/edit-product.dto';
import { GetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { LocationService } from 'src/services/location.service';
import { ProductService } from 'src/services/product.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  
  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl()
  });

  productId = 0;
  product!: GetDetailedProduct;

  locations: GetSimpleLocation[] = [];

  isLoading = false;

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        this.locations = locations;
        this.locations.unshift(new GetSimpleLocation(null, 'No SubLocation'));

        this.productService
          .getDetailedProductById(this.productId)
          .subscribe((product: GetDetailedProduct) => {
            this.product = product;
            let selectedLocation = this.locations[0];

            if (this.product.location.id != null) {
              selectedLocation = this.locations[this.product.location.id];
            }

            this.fillForm(this.product, selectedLocation);
            this.isLoading = false;
          }
        );
      }
    );
  }

  fillForm(product: GetDetailedProduct, selectedLocation: GetSimpleLocation) {
    this.editForm = new FormGroup({
      name: new FormControl(product.name),
      description: new FormControl(product.description),
      location: new FormControl(selectedLocation)
    });
  }

  onSubmit() {
    let product = this.editForm.value as EditProduct;
    product.id = this.productId;
    product.locationId = this.editForm.value.location.id;

    this.isLoading = true;

    this.productService.editProduct(product).subscribe(
      (res: any) => {
        this.router.navigate(['/products', this.productId]).then(() => {
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
