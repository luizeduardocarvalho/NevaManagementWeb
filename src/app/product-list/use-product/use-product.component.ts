import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { UseProduct } from 'src/models/product/use-product.dto';
import { IUser } from 'src/models/user/user.dto';
import { ProductService } from 'src/services/product.service';
import { ToastService } from 'src/services/toast.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './use-product.component.html',
  styleUrls: ['./use-product.component.scss'],
  providers: [DatePipe],
})
export class UseProductComponent implements OnInit {
  useProductForm = new FormGroup({
    researcherName: new FormControl({ value: '', disabled: true }),
    date: new FormControl({ value: '', disabled: true }),
    productName: new FormControl({ value: '', disabled: true }),
    quantity: new FormControl(0),
    unit: new FormControl({ value: '', disabled: true }),
    description: new FormControl(''),
  });

  user?: IUser;
  product?: IGetDetailedProduct;
  productId: number = 0;

  isLoading = false;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.user = this.userService.getUser();

    this.isLoading = true;

    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: IGetDetailedProduct) => {
        this.product = product;

        this.useProductForm = new FormGroup({
          researcherName: new FormControl({
            value: this.user?.name,
            disabled: true,
          }),
          date: new FormControl({
            value: this.datepipe.transform(new Date(), 'dd/MM/yyyy - HH:mm'),
            disabled: true,
          }),
          productName: new FormControl({
            value: this.product?.name,
            disabled: true,
          }),
          quantity: new FormControl(0),
          unit: new FormControl({ value: this.product?.unit, disabled: true }),
          description: new FormControl(''),
        });

        this.isLoading = false;
      });
  }

  onSubmit() {
    let form = this.useProductForm.value;
    let quantity = form.quantity;
    let description = form.description;
    let useProduct = new UseProduct(
      this.user!.id,
      this.productId,
      quantity,
      description,
      this.product!.unit
    );

    this.isLoading = true;

    this.productService.useProduct(useProduct).subscribe(
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
            });
          });

          this.toastService.show(message, 'Error', true);
          this.isLoading = false;
        }
      },
      () => (this.isLoading = false)
    );
  }
}
