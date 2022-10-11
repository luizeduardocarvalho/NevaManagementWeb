import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionBase } from 'src/models/form/question-base';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { IUseProduct } from 'src/models/product/use-product.dto';
import { IUser } from 'src/models/user/user.dto';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';
import { UserService } from 'src/services/user.service';

@Component({
  templateUrl: './use-product.component.html',
  styleUrls: ['./use-product.component.scss'],
  providers: [DatePipe],
})
export class UseProductComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'researcherName',
      label: 'Researcher Name',
      type: 'text',
      disabled: true,
      order: 1,
    },
    {
      key: 'productName',
      label: 'Product Name',
      type: 'text',
      order: 2,
      value: '',
      disabled: true,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'text',
      order: 3,
      value: '',
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      order: 4,
      value: '',
      disabled: true,
    },
    {
      key: 'usageDate',
      label: 'Usage Date',
      type: 'date',
      order: 5,
      value: '',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 6,
      value: '',
    },
  ];

  user!: IUser;
  isLoading = false;
  productId = 0;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private questionService: QuestionService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.user = this.userService.getUser();

    this.isLoading = true;

    this.productService
      .getDetailedProductById(this.productId)
      .subscribe((product: IGetDetailedProduct) => {
        this.questionsTypes[0].value = this.user.name;
        this.questionsTypes[1].value = product.name;
        this.questionsTypes[3].value = product.unit;
        this.questions = this.questionService.getQuestions(this.questionsTypes);

        this.isLoading = false;
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    var parsedPayload = JSON.parse(payload) as IUseProduct;
    parsedPayload.productId = this.productId;
    parsedPayload.researcherId = this.user.id;

    this.productService.useProduct(parsedPayload).subscribe(
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
