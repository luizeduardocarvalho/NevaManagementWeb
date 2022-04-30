import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddQuantity } from 'src/models/product/add-quantity.dto';
import { GetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { ProductService } from 'src/services/product.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss']
})
export class AddQuantityComponent implements OnInit {

  addQuantityForm = new FormGroup({
    quantity: new FormControl(0),
    name: new FormControl({ value: '', disabled: true }),
    unit: new FormControl({ value: '', disabled: true }),
  });

  productId: number = 0;
  product?: GetDetailedProduct;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

    this.isLoading = true;

    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: GetDetailedProduct) => {
        this.product = product;

        this.addQuantityForm = new FormGroup({
          quantity: new FormControl(0),
          name: new FormControl({ value: this.product?.name, disabled: true }),
          unit: new FormControl({ value: this.product?.unit, disabled: true }),
        });

        this.isLoading = false;
      });
  }

  onSubmit() {
    let addQuantityDto = this.addQuantityForm.value as AddQuantity;
    addQuantityDto.productId = this.productId;

    this.isLoading = true;

    this.productService
      .addProductQuantity(addQuantityDto)
      .subscribe(
        (res: any) => {
          this.router.navigate(['/products/' + this.productId]).then(() => {
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
