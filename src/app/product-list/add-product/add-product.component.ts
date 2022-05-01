import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateProductDto } from 'src/models/product/create-product-dto';
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
  });

  isLoading = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.isLoading = true;
    let product = this.createForm.value as CreateProductDto;
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
        } else {
          message = err.error;
        }

        this.toastService.show(message, 'Error', true);
        this.isLoading = false;
      },
      () => this.isLoading = false
    );
  }
}
