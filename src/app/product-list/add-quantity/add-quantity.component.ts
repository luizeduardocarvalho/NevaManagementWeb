import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionBase } from 'src/models/form/question-base';
import { IAddQuantity } from 'src/models/product/add-quantity';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss'],
})
export class AddQuantityComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'text',
      order: 1,
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      order: 2,
      value: '',
      disabled: true,
    },
  ];

  isLoading = false;
  productId = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
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
        this.questionsTypes[1].value = product.unit;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let parsedPayload = JSON.parse(payload) as IAddQuantity;
    parsedPayload.productId = this.productId;

    this.productService.addProductQuantity(parsedPayload).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/products/' + this.productId]).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
