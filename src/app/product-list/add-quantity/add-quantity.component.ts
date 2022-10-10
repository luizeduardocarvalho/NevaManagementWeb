import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionBase } from 'src/models/form/question-base';
import { IAddQuantity } from 'src/models/product/add-quantity';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss'],
})
export class AddQuantityComponent implements OnInit {
  questions$: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
      value: '',
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'text',
      order: 2,
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      order: 3,
      value: '',
    },
  ];

  isLoading = false;
  productId = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastService: ToastService,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questions$ = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.isLoading = true;

    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: IGetDetailedProduct) => {
        this.isLoading = false;
        this.questionsTypes[2].value = product.unit;
        this.questions$ = this.questionService.getQuestions(
          this.questionsTypes
        );
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.productService.addProductQuantity(payload as IAddQuantity).subscribe(
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
